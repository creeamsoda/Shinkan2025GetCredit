//// JavaScript source code
//var canvas = document.getElementById("myCanvas");
//var ctx = canvas.getContext("2d");
//var ballRadius = 10;
//var x = canvas.width / 2;
//var y = canvas.height - 30;
//var dx = 2;
//var dy = -2;
//var paddleHeight = 10;
//var paddleWidth = 75;
//var paddleX = (canvas.width - paddleWidth) / 2;
//var rightPressed = false;
//var leftPressed = false;
//var brickRowCount = 3;
//var brickColumnCount = 5;
//var brickWidth = 75;
//var brickHeight = 20;
//var brickPadding = 10;
//var brickOffsetTop = 30;
//var brickOffsetLeft = 30;

//var bricks = [];
//for (var c = 0; c < brickColumnCount; c++) {
//    bricks[c] = [];
//    for (var r = 0; r < brickRowCount; r++) {
//        bricks[c][r] = { x: 0, y: 0 };
//    }
//}

//document.addEventListener("keydown", keyDownHandler, false);
//document.addEventListener("keyup", keyUpHandler, false);

//function keyDownHandler(e) {
//    if (e.key == "Right" || e.key == "ArrowRight") {
//        rightPressed = true;
//    }
//    else if (e.key == "Left" || e.key == "ArrowLeft") {
//        leftPressed = true;
//    }
//}

//function keyUpHandler(e) {
//    if (e.key == "Right" || e.key == "ArrowRight") {
//        rightPressed = false;
//    }
//    else if (e.key == "Left" || e.key == "ArrowLeft") {
//        leftPressed = false;
//    }
//}

//function drawBall() {
//    ctx.beginPath();
//    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
//    ctx.fillStyle = "#0095DD";
//    ctx.fill();
//    ctx.closePath();
//}
//function drawPaddle() {
//    ctx.beginPath();
//    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
//    ctx.fillStyle = "#0095DD";
//    ctx.fill();
//    ctx.closePath();
//}
//function drawBricks() {
//    for (var c = 0; c < brickColumnCount; c++) {
//        for (var r = 0; r < brickRowCount; r++) {
//            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
//            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
//            bricks[c][r].x = brickX;
//            bricks[c][r].y = brickY;
//            ctx.beginPath();
//            ctx.rect(brickX, brickY, brickWidth, brickHeight);
//            ctx.fillStyle = "#0095DD";
//            ctx.fill();
//            ctx.closePath();
//        }
//    }
//}

//function draw() {
//    ctx.clearRect(0, 0, canvas.width, canvas.height);
//    drawBall();
//    drawBricks();
//    drawPaddle();

//    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
//        dx = -dx;
//    }
//    if (y + dy < ballRadius) {
//        dy = -dy;
//    }
//    else if (y + dy > canvas.height - ballRadius) {
//        if (x > paddleX && x < paddleX + paddleWidth) {
//            dy = -dy;
//        }
//        else {
//            alert("GAME OVER");
//            document.location.reload();
//            clearInterval(interval); // Needed for Chrome to end game
//        }
//    }

//    if (rightPressed && paddleX < canvas.width - paddleWidth) {
//        paddleX += 7;
//    }
//    else if (leftPressed && paddleX > 0) {
//        paddleX -= 7;
//    }

//    x += dx;
//    y += dy;
//}

//var interval = setInterval(draw, 10);

import { GetCreditResult } from "./GetCreditResult.js";
import { InitInputChecker } from "./InputChecker.js";
import { NowPlayer } from "./PlayerMover.js";
import { CreditManager } from "./CreditManager.js";
import { InitGameManager, Update, CheckGetCreditResult, Score, IsHitStoping, CheckEndGame, DebugScoreGet, DebugTimeUntilReachLineGet } from "./GameManager.js";
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
    Draw(Score, NowPlayer, CreditManager.CreditsList);
    DebugDraw(DebugScoreGet(), DebugTimeUntilReachLineGet(CreditManager.CreditsList));

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
//let roop = requestAnimationFrame(GameRoop);
let interval = setInterval(GameRoop, 10);