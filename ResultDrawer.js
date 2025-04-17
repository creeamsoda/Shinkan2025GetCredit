import * as UiConst from "./UiConst.js";
import { ctx, FillUi } from "./Drawer.js";
import { Ui } from "./Ui.js";
import { Vector2 } from "./Common.js";

export function DrawResultBoard(resultRecorder){
    // 背景
    FillSquare(UiConst.ResultBackground);

    // 「成績」の文字
    FillUi(UiConst.GradeText, "");

    // スコア
    FillUi(UiConst.ResultScoreText, resultRecorder.Score);

    // 「取得した単位」の文字
    FillUi(UiConst.ResultGetCreditText, "");

    // 「落とした単位」の文字
    FillUi(UiConst.ResultFailCreditText, "");

    // それぞれの単位名を描画していく
    for (let i=0; i<resultRecorder.GetCredits.length; i++){
        FillResultCreditName(resultRecorder.GetCredits[i], UiConst.ResultGetCreditText, OrganizeResultCreditText(i), 0.25);
    }
    for (let i=0; i<resultRecorder.FailCredits.length; i++){
        FillResultCreditName(resultRecorder.FailCredits[i], UiConst.ResultFailCreditText, OrganizeResultCreditText(i), 0.25);
    }

    if(resultRecorder.FailCredits.length == 0){
        // 「フル単！」の文字
        FillUi(UiConst.ResultFullGetCreditText,"");
    }else if(resultRecorder.GetCredits.length == 0){
        // 「フル落単！」の文字
        FillUi(UiConst.ResultFullFailCreditText,"");
    }
}

function FillSquare(uiSquare){
    ctx.fillStyle = uiSquare.Color;
    ctx.fillRect(uiSquare.Position.x, uiSquare.Position.y, uiSquare.Size.x, uiSquare.Size.y);
}

export function FillResultCreditName(creditName, baseText, offset, sizeRate){
    FillUi(new Ui(creditName, baseText.Position.add(offset), UiConst.ResultCreditNameText.Color, GetFontSize(UiConst.ResultCreditNameText.TextSize)*sizeRate+"px", UiConst.ResultCreditNameText.Font))
}

function OrganizeResultCreditText(index){
    let y;
    if(index < 5){ y = -30;}
    else if(index < 10){ y = -10; }
    else if(index < 15){ y = 10; }
    else { y = 30; }
    return new Vector2(350+100*(index%5),y);
}

function GetFontSize(fontSizeText){
    let length = fontSizeText.length;
    let fontSixeNumber = fontSizeText.substr(0, length-2); // 末尾のpxを取り除く
    return Number(fontSixeNumber);
}