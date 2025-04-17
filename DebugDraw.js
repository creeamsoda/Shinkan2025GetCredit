import * as GameConst from "./GameConst.js"
import * as UiConst from "./UiConst.js"
import { FillUi } from "./Drawer.js";
import { FillResultCreditName } from "./ResultDrawer.js";
import { Vector2 } from "./Common.js";

// デバッグ用のいろんな値を画面に出す関数です


export function DrawCatchableArea(ctx){
    ctx.beginPath();
    ctx.moveTo(0, GameConst.UpperCatchableArea);
    ctx.lineTo(10000, GameConst.UpperCatchableArea);
    ctx.moveTo(0, GameConst.BottomCatchableArea);
    ctx.lineTo(10000, GameConst.BottomCatchableArea);
    ctx.fillStyle = "purple";
    ctx.stroke();
    ctx.closePath();
}

export function DrawScore(ctx, Score){
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillText("Score:"+String(Score), 400, 110);
    ctx.closePath();
}

export function DrawTimeUntilReachLine(ctx, time){
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillText("TimeUntilReachLine:"+String(time), 400, 100);
    ctx.closePath();
}

export function DrawCreditSize(ctx){
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(GameConst.CreditStartPosition.x, GameConst.CreditStartPosition.y, GameConst.CreditSize.x, GameConst.CreditSize.y)
    ctx.closePath();
}

export function DrawResultText(){
    for(let i=0; i<9;i++){
        FillResultCreditName("イスラーム世界論", UiConst.ResultGetCreditText, OrganizeResultCreditText(i), 0.25);
    }
    
    FillResultCreditName("イスラーム世界論", UiConst.ResultGetCreditText, new Vector2(350+100,0), 0.25);
}

function OrganizeResultCreditText(index){
    let y;
    if(index < 5){ y = 0;}
    else if(index < 10){ y = 20; }
    else{ y = 40; }
    return new Vector2(350+100*(index%5),y);
}