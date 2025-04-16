// ゲームシステムの全てを司るモジュール

import * as GameConst from "./GameConst.js";
import { DelaySeconds } from "./Common.js";
import { CreditState } from "./CreditState.js"
import { GetCreditResult } from "./GetCreditResult.js";
import { SpawnNextCredits } from "./ProfesserManager.js";
import { IsRightPressedDown, UpdateInput } from "./InputChecker.js";
import { TryPlayerExtendHandHappy, TryPlayerExtendHandSad, SleepPlayer, NowPlayer, PlayerState } from "./PlayerMover.js";
import { CancellationToken } from "./CancellationToken.js";

let passedSecondsAfterSpawnPreviousCredits;
export let Score = 0;
let nextGetScore = 0;
export let IsHitStoping = false;
let getCreditResultInthisFrame = GetCreditResult.Stay;
let playerBackToSleepTask = null;

export function InitGameManager(){
    passedSecondsAfterSpawnPreviousCredits = 0;
    Score = 0;
    IsHitStoping = false;
}

export function Update(deltaSeconds, CreditsList, resultRecorder){
    // 前回単位を生成してから経過した時間を計算
    passedSecondsAfterSpawnPreviousCredits += deltaSeconds;
    // タイミングが良ければ単位を生成
    if (passedSecondsAfterSpawnPreviousCredits > GameConst.SpawnCreditsSpan){
        SpawnNextCredits(CreditsList);
        // 単位を生成してからの経過時間をリセット
        passedSecondsAfterSpawnPreviousCredits = 0;
    }

    // ボタン入力チェック
    UpdateInput();

    // いずれかの単位が落下中なら
    for (let i=0; i<CreditsList.length; i++){
        if(CreditsList[i].State == CreditState.FailAndFalling && CreditsList[i].Position.y >= GameConst.WindowSize.y){
            CreditsList[i].State = CreditState.End;
            break;
        }else if(CreditsList[i].State == CreditState.FailAndFalling){
            let isNowExtendHand = TryPlayerExtendHandSad(IsRightPressedDown);
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
                resultRecorder.Score = Score;
                break;
            }else{
                // 入力を動きに反映する。このフレームで手を伸ばしたのならisNowExtendHandにtrueが入り、以前のフレームですでに伸ばしていたり、今伸ばしていないのならfalseが入る
                let isNowExtendHand = TryPlayerExtendHandHappy(IsRightPressedDown);

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

function CalculateScore(Credit){
    // あと何秒でBottomCatchableAreaに到達していたのかを計算する
    let timeUntilReachBottom = CalculateTimeUntilReachLine(Credit, GameConst.BottomCatchableArea);

    // 残り秒数をもとにしたスコアの計算式（感覚）
    let calculateResult = 0.5*Math.exp(-5*timeUntilReachBottom) - 0.3*(timeUntilReachBottom - 4) - 0.9;
    if (calculateResult < 0){
        calculateResult = 0;
    }

    calculateResult *= 100;
    // 単位取得ポイントをのせて最終スコアとする
    return calculateResult += GameConst.GetCreditPoint;
}

// 等加速度運動でLineの位置に到達するまでの時間を求める（初速度の向きと加速度の向きがともに正である必要あり）
function CalculateTimeUntilReachLine(Credit, Line){
    // 現在地からLineまでの距離
    let distanceFromLine = Line - Credit.Position.y;
    // 速度を加速度で割った値、計算中に何度か出てきたので変数にしておく
    let veloDivineAccel = Credit.Velocity.y / GameConst.GravityAcceleration.y;
    
    // 解の公式を変形して所要時間を求める
    return ( - veloDivineAccel
        + Math.sqrt(veloDivineAccel*veloDivineAccel + 2*distanceFromLine/GameConst.GravityAcceleration.y));
}

export function DebugScoreGet(){
    return Score;
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

// ゲームが終わったかどうかを判定する
export function CheckEndGame(CreditsList){
    for(let i=0; i<CreditsList.length; i++){
        if(CreditsList[i].State != CreditState.End){
            return false;
        }
    }
    return true;
}

export function DebugTimeUntilReachLineGet(CreditsList){
    for (let i=0; i<CreditsList.length; i++){
        if(CreditsList[i].State == CreditState.CaughtByPlayer){
            return CalculateTimeUntilReachLine(CreditsList[i], GameConst.BottomCatchableArea);
        }
        // 落下中の単位のうち、一番インデックス（iの値）が小さいものについて残り時間を計算
        if(CreditsList[i].State == CreditState.Falling && CreditsList[i].Position.y <= GameConst.BottomCatchableArea){
            return CalculateTimeUntilReachLine(CreditsList[i], GameConst.BottomCatchableArea);
        }
    }
    return 0;
}