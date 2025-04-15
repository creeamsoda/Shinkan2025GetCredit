// 描画を行うモジュール

import * as GameConst from "./GameConst.js";
import * as UiConst from "./UiConst.js";
import { DelaySeconds } from "./Common.js";
import { GetCreditResult } from "./GetCreditResult.js";
import * as Debug from "./DebugDraw.js";

// 変数の宣言
let canvas;
/** @type {HTMLCanvasElement} */
let ctx;

// 一時的に画面に表示するものを描画する関数を入れる動的なリスト
let drawUiCallback;
// 「得単」か「落単」の文字を一定時間描画するタスク
let drawGetCreditResultTextTask;
let drawScoreIncreaseTextTask;


// 画像
let imageBed;
let imagePlayerSleep;
let imagePlayerSad;
let imagePlayerHappy;
let imageProfesserBody
let imageProfesserHand;

// 初期化を行う関数
export function InitDrawer() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    drawGetCreditResultTextTask = [];
    drawScoreIncreaseTextTask = [];
    drawUiCallback = [drawGetCreditResultTextTask, drawScoreIncreaseTextTask];

    // 画像の読み込み
    LoadImages();
}



export function Draw(Score, IsPlayerExtendingHand, CreditsList) {
    ctx.beginPath();
    // 画面を一旦クリアする
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ベッドの描画
    ctx.drawImage(imageBed,0,0);

    // 主人公の描画
    DrawPlayer(IsPlayerExtendingHand);

    // 教授の身体の描画
    ctx.drawImage(imageProfesserBody,0,0);

    // 単位の描画
    DrawCredits(CreditsList);
    //Debug.DrawCreditSize(ctx);

    // 教授の手の描画
    ctx.drawImage(imageProfesserHand,0,0);


    // UIの描画
    DrawUi(Score);

    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();

    
    ctx.closePath();
}

export function DebugDraw(Score, TimeUntilReachLine){
    ctx.beginPath();
    // ctx.drawImage(imagePlayerHappy,0,0);

    Debug.DrawCatchableArea(ctx);
    Debug.DrawScore(ctx, Score);
    Debug.DrawTimeUntilReachLine(ctx, TimeUntilReachLine);

    ctx.closePath();
}

function DrawPlayer(IsPlayerExtendingHand) {
    ctx.beginPath();
    if (IsPlayerExtendingHand == true){
        ctx.drawImage(imagePlayerHappy, GameConst.PlayerPosition.x, GameConst.PlayerPosition.y);
    }else{
        ctx.drawImage(imagePlayerSleep, GameConst.PlayerPosition.x, GameConst.PlayerPosition.y);
    }
    ctx.closePath();
}

function DrawCredits(CreditsList){
    ctx.beginPath();
    for (let i=0; i<CreditsList.length; i++){
        if (CreditsList[i].IsShowing() == true){
            ctx.fillStyle = "green";
            ctx.fillRect(CreditsList[i].Position.x, CreditsList[i].Position.y, GameConst.CreditSize.x, GameConst.CreditSize.y);
            ctx.fillStyle = "black";
            ctx.fillText(CreditsList[i].Name, CreditsList[i].Position.x, CreditsList[i].Position.y);
        }
    }
    ctx.closePath();
}

export async function GenerateDrawGetCreditResultText(getResult, cancellationToken){
    if(getResult == GetCreditResult.Get){
        //drawUiCallback.push(DrawGetCreditText());
        //drawUiCallback.push( function(){ FillUi(UiConst.GetCreditText,""); })
        //drawGetCreditResultTextTask = function(){ FillUi(UiConst.GetCreditText, ""); };
        ClearAndAddTask(drawGetCreditResultTextTask, function(){ FillUi(UiConst.GetCreditText,""); });
        //drawGetCreditResultTextTask.splice(0, drawGetCreditResultTextTask.length, function(){ FillUi(UiConst.GetCreditText, ""); });
    }else{
        //drawUiCallback.push( function(){ FillUi(UiConst.FailCreditText,""); });
        //drawGetCreditResultTextTask = function(){ FillUi(UiConst.FailCreditText, ""); };
        ClearAndAddTask(drawGetCreditResultTextTask, function(){ FillUi(UiConst.FailCreditText,""); });
        //drawGetCreditResultTextTask.splice(0, drawGetCreditResultTextTask.length, function(){ FillUi(UiConst.FailCreditText, ""); });
    }
    // await DelaySeconds(1).then(function(){ drawUiCallback.shift()});
    await DelaySeconds(8, cancellationToken).then( function(){ drawGetCreditResultTextTask.splice(0, drawGetCreditResultTextTask.length); });
    console.log("Self Cancel");
}

export async function GenerateScoreIncreaseText (scoreIncrease, cancellationToken) {
    if(scoreIncrease > 0){
        ClearAndAddTask(drawScoreIncreaseTextTask, function(){ FillUi(UiConst.ScoreIncreaseText, scoreIncrease); });
    }else{
        ClearAndAddTask(drawScoreIncreaseTextTask, function(){ FillUi(UiConst.ScoreDecreaseText, scoreIncrease); });
    }

    await DelaySeconds(8, cancellationToken).then( function(){ ClearAndAddTask(drawScoreIncreaseTextTask); });
}

function DrawUi(Score){
    FillUi(UiConst.ScoreText, "");
    FillUi(UiConst.ScoreNumber, Score);
    for(let i=0; i<drawUiCallback.length; i++){
        if (drawUiCallback[i] != null){
            for (let j=0; j<drawUiCallback[i].length; j++){
                if (drawUiCallback[i][j] != null){
                    drawUiCallback[i][j]();
                    console.log("callback is active");
                }
            }
        }else{
            console.log("callback is null");
        }
    }
}

function FillUi(Ui, additionalText){
    ctx.beginPath();
    ctx.fillStyle = Ui.Color;
    ctx.font = Ui.TextSize+" "+Ui.Font;
    // ctx.font = Ui.TextSize+" Arial";
    ctx.fillText(Ui.Text+additionalText, Ui.Position.x, Ui.Position.y);
    ctx.closePath();
}

function ClearAndAddTask(taskList, newTask = null){
    if (newTask == null){
        taskList.splice(0, taskList.length);
    }else{
        taskList.splice(0, taskList.length, newTask);
    }
}


function LoadImages(){
    imageBed = new Image();
    imageBed.src = "./images/bed.PNG";
    imagePlayerHappy = new Image();
    imagePlayerHappy.src = "./images/playerHappy.PNG"
    imagePlayerSad = new Image();
    imagePlayerSad.src = "./images/playerSad.PNG";
    imagePlayerSleep = new Image();
    imagePlayerSleep.src = "./images/playerSleep.PNG";
    imageProfesserBody = new Image();
    imageProfesserBody.src = "./images/professerBody.PNG";
    imageProfesserHand = new Image();
    imageProfesserHand.src = "./images/professerHand.PNG";
}