// ゲームシステムの全てを司るモジュール

import * as GameConst from "./GameConst.js";
import { DelaySeconds } from "./Common.js";
import { CreditState } from "./CreditState.js"
import { GetCreditResult } from "./GetCreditResult.js";
import { SpawnNextCredits } from "./CreditsSpawner.js";
import { IsKeyPressedDown, UpdateInput } from "./InputChecker.js";
import { TryPlayerExtendHandHappy, TryPlayerExtendHandSad, SleepPlayer, NowPlayer, PlayerState } from "./PlayerMover.js";
import { CalculateScore } from "./CalculateScore.js";
import { CancellationToken } from "./CancellationToken.js";

let passedSecondsAfterSpawnPreviousCredits;
let nextSpawnCreditsSpan;
export let Score = 0;
let nextGetScore = 0;
export let IsHitStoping = false;
let getCreditResultInthisFrame = GetCreditResult.Stay;
let playerBackToSleepTask = null;

export function InitGameManager(){
    passedSecondsAfterSpawnPreviousCredits = 0;
    nextSpawnCreditsSpan = GameConst.SpawnCreditsSpan;
    Score = 0;
    IsHitStoping = false;
}


// 毎フレーム呼び出される関数。
export function Update(deltaSeconds, CreditsList, resultRecorder){

    // ↓↓ (発展)単位を落とす間隔をランダムにしてみよう

    // 前回単位を生成してから経過した時間を計算
    passedSecondsAfterSpawnPreviousCredits += deltaSeconds;
    // 前回生成からnextSpawnCreditSpan秒が経過していたら単位を生成
    if (passedSecondsAfterSpawnPreviousCredits > nextSpawnCreditsSpan){
        // 単位の生成、第二引数（カッコの中の2番目の数）は教授が単位を手に掴んでいる時間
        SpawnNextCredits(CreditsList, 1);

        // 単位を生成してからの経過時間をリセット
        passedSecondsAfterSpawnPreviousCredits = 0;
        // 次回の単位の生成が何秒後かをここで決めている
        nextSpawnCreditsSpan = GameConst.SpawnCreditsSpan;
    }

    // ↑↑ (発展)単位を落とす間隔をランダムにしてみよう

    // ボタン入力チェック
    UpdateInput();

    // いずれかの単位が落下中なら
    for (let i=0; i<CreditsList.length; i++){
        if(CreditsList[i].State == CreditState.FailAndFalling && CreditsList[i].Position.y >= GameConst.WindowSize.y){
            CreditsList[i].State = CreditState.End;
            break;
        }else if(CreditsList[i].State == CreditState.FailAndFalling){
            let isNowExtendHand = TryPlayerExtendHandSad(IsKeyPressedDown);
            if(isNowExtendHand == true){
                playerBackToSleepTask = new CancellationToken();
                DelaySeconds(0.5, playerBackToSleepTask).then(function(){ SleepPlayer(); playerBackToSleepTask = null; });
            }
            break;
        }
        else if(CreditsList[i].State == CreditState.Falling){
            if(CreditsList[i].Position.y >= GameConst.BottomCatchableArea){
                CreditsList[i].State = CreditState.FailAndFalling;
                getCreditResultInthisFrame = GetCreditResult.Fail;
                // 結果の記録
                resultRecorder.FailCredits.push(CreditsList[i].Name);
                nextGetScore += GameConst.FailCreditPoint;
                Score += nextGetScore;
                resultRecorder.Score = Score;
                break;
            }else{
                // 入力を動きに反映する。このフレームで手を伸ばしたのならisNowExtendHandにtrueが入り、以前のフレームですでに伸ばしていたり、今伸ばしていないのならfalseが入る
                let isNowExtendHand = TryPlayerExtendHandHappy(IsKeyPressedDown);

                // 手を伸ばした瞬間にスコアの上昇量が決定（実際にはキャッチした瞬間に足す）
                if(isNowExtendHand == true){
                    nextGetScore = CalculateScore(CreditsList[i]);
                    // 今悲しい顔をしていたら、一定時間後に悲しい顔から睡眠へもどるという機能をキャンセルする
                    if(playerBackToSleepTask != null){
                        playerBackToSleepTask.cancel();
                        playerBackToSleepTask = null;
                    }
                }
                break;
            }
        }
    }



    // 単位がキャッチできる位置に来ているか調べる
    let CatchableCredit = CheckAbleToCatch(CreditsList);
    if(CatchableCredit != null){
        CatchCredit(CatchableCredit, resultRecorder);
    }
}

function CheckAbleToCatch(CreditsList){
    // 主人公が手を伸ばしていない状況ならキャッチできるわけがないのでここでチェック終了
    if ( NowPlayer == PlayerState.Sleeping ){
        return null;
    }

    // ここからは単位一つ一つについて座標をチェックする
    for (let i=0; i<CreditsList.length; i++){
        if (CreditsList[i].State == CreditState.Falling){
            if(GameConst.UpperCatchableArea <= CreditsList[i].Position.y 
                && CreditsList[i].Position.y <= GameConst.BottomCatchableArea)
            {
                return CreditsList[i];
                
            }
        }
    }
}





async function CatchCredit(credit, resultRecorder) {
    // 単位をキャッチされている状態にする
    Score += nextGetScore;
    credit.State = CreditState.CaughtByPlayer;
    getCreditResultInthisFrame = GetCreditResult.Get;

    // 結果の記録
    resultRecorder.GetCredits.push(credit.Name);
    resultRecorder.Score = Score;

    // この操作はキャンセルされないという意思
    let cancellationToken = null;

    // ヒットストップで全ての単位の落下、生成を一時停止する
    await HitStop(0.8, cancellationToken);

    // その単位を見えない状態にする
    credit.State = CreditState.End;

    // 主人公を寝ている状態に戻す
    SleepPlayer();
}

// ヒットストップフラグを立て、一定秒数後にフラグを下げる
async function HitStop(seconds, cancellationToken){
    IsHitStoping = true;
    await DelaySeconds(seconds, cancellationToken).then(function(){ IsHitStoping = false; });
}

// 一度読み込まれるまで結果を保持するゲッター
export function CheckGetCreditResult(){
    if (getCreditResultInthisFrame == GetCreditResult.Get){
        getCreditResultInthisFrame = GetCreditResult.Stay;
        let scoreIncrease = nextGetScore;
        nextGetScore = 0;
        return {result: GetCreditResult.Get, score: scoreIncrease};
    }
    else if (getCreditResultInthisFrame == GetCreditResult.Fail){
        getCreditResultInthisFrame = GetCreditResult.Stay;
        let scoreIncrease = nextGetScore;
        nextGetScore = 0;
        return {result: GetCreditResult.Fail, score: scoreIncrease};
    }
    
    // getCreditResultInThisFrame == GetCreditResult.Stay
    return {result: GetCreditResult.Stay, score: 0};
}


// 単位が近づいてきたときに判定の線を消すかどうか判定するための関数
export function CheckFallingCreditsInShowingLinePosition(CreditsList){
    // プレイヤーがキャッチしている単位があるとき（ヒットストップ中）は他の単位にかかわらず線を表示する
    if (IsHitStoping == true){
        return true;
    }

    // 落下中の単位をチェックする
    for (let i=0; i<CreditsList.length; i++){
        if(CreditsList[i].State == CreditState.Falling 
            && CreditsList[i].Position.y >= GameConst.EnableShowCatchableAreaBorder)
        {
            // 中盤からギリギリ下までのエリアを落ちている単位があるときは線を表示しない
            return false;
        }
    }

    // ヒットストップ中でもなく、落下している単位も中盤から終盤のエリアにいなければ線を表示する
    return true;
}

// ゲームが終わったかどうかを判定する
export function CheckEndGame(CreditsList){
    for(let i=0; i<CreditsList.length; i++){
        if(CreditsList[i].State != CreditState.End){
            return false;
        }
    }
    return true;
}


// ↓↓ デバッグに使っていたものです。今はもう動かないかも？
// import { CalculateTimeUntilReachLine } from "./CalculateScore.js";

// export function DebugTimeUntilReachLineGet(CreditsList){
//     for (let i=0; i<CreditsList.length; i++){
//         if(CreditsList[i].State == CreditState.CaughtByPlayer){
//             return CalculateTimeUntilReachLine(CreditsList[i], GameConst.BottomCatchableArea);
//         }
//         // 落下中の単位のうち、一番インデックス（iの値）が小さいものについて残り時間を計算
//         if(CreditsList[i].State == CreditState.Falling && CreditsList[i].Position.y <= GameConst.BottomCatchableArea){
//             return CalculateTimeUntilReachLine(CreditsList[i], GameConst.BottomCatchableArea);
//         }
//     }
//     return 0;
// }