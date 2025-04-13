import * as GameConst from "./GameConst.js"

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