import { GetCreditResult } from "./GetCreditResult.js";
import { InitInputChecker } from "./InputChecker.js";
import { NowPlayer } from "./PlayerMover.js";
import { CreditManager } from "./CreditManager.js";
import { InitGameManager, Update, CheckGetCreditResult, Score, IsHitStoping, CheckEndGame, CheckFallingCreditsInShowingLinePosition, /*DebugTimeUntilReachLineGet*/ } from "./GameManager.js";
import { ResultRecorder } from "./ResultRecorder.js";
import { InitDrawer, Draw, GenerateDrawGetCreditResultText, GenerateScoreIncreaseText, DebugDraw } from "./Drawer.js";
import { DrawResultBoard } from "./ResultDrawer.js";
import { CancellationToken } from "./CancellationToken.js";

// 前回のフレームがいつだったのかを表す時刻の値
let previousFrameTimeStamp;

let getCreditResultTextTask = null;

let isInResult = false;
let resultRecorder = new ResultRecorder();

// ゲームの初期化
function GameInit() {
    // フレームの開始時刻を記録
    previousFrameTimeStamp = new Date().getTime();

    // 入力チェックの初期化
    InitInputChecker();

    InitGameManager();

    InitDrawer();
}

// メインループ
function GameRoop() {
    // フレーム間の経過時間を計算する
    let deltaSeconds = DeltaSeconds(IsHitStoping);

    // 単位を下に向かって動かす
    CreditManager.MoveShowingCredits(deltaSeconds);

    // GameManager.jsの毎フレーム処理を呼ぶ
    Update(deltaSeconds, CreditManager.CreditsList, resultRecorder);

    // 落単か得単か調べる
    let getResultAndScore = CheckGetCreditResult();
    if (getResultAndScore.result != GetCreditResult.Stay){
        CancelTask(getCreditResultTextTask);
        getCreditResultTextTask = new CancellationToken();
        GenerateDrawGetCreditResultText(getResultAndScore.result, getCreditResultTextTask);
        GenerateScoreIncreaseText(getResultAndScore.score, getCreditResultTextTask);
    }

    // 描画
    Draw(Score, NowPlayer, CreditManager.CreditsList, CheckFallingCreditsInShowingLinePosition(CreditManager.CreditsList));
    //DebugDraw(Score);

    if(isInResult == false){
        isInResult = CheckEndGame(CreditManager.CreditsList);
    } 
    else // リザルト画面の描画
    {
        DrawResultBoard(resultRecorder);
    }
}

// 前のフレームからの経過時間(秒)を計算する。ヒットストップにも対応。
function DeltaSeconds(isHitStoping){
    // ヒットストップ中でなければ普通に計算する
    let nowFrameTimeStamp = new Date().getTime();
    let deltaMilliSeconds = nowFrameTimeStamp - previousFrameTimeStamp;
    previousFrameTimeStamp = nowFrameTimeStamp;
    //ヒットストップ中は経過秒数を0として返す
    if (isHitStoping == true){
        console.log("DeltaSeconds = 0");
        return 0;
    }
    return deltaMilliSeconds * 0.001;
}

function CancelTask(task){
    if (task != null){
        task.cancel();
    }
}

GameInit();
let interval = setInterval(GameRoop, 10);