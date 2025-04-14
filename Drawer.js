// 描画を行うモジュール

import * as GameConst from "./GameConst.js";
import * as UiConst from "./UiConst.js";
import * as Debug from "./DebugDraw.js";

// 変数の宣言
let canvas;
/** @type {HTMLCanvasElement} */
let ctx;

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

function DrawUi(Score){
    FillUi(UiConst.ScoreText, "");
    FillUi(UiConst.ScoreNumber, Score);
}

function FillUi(Ui, additionalText){
    ctx.beginPath();
    ctx.fillStyle = Ui.Color;
    ctx.font = Ui.TextSize+" "+Ui.Font;
    // ctx.font = Ui.TextSize+" Arial";
    ctx.fillText(Ui.Text+additionalText, Ui.Position.x, Ui.Position.y);
    ctx.closePath();
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