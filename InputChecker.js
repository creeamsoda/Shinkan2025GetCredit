// JavaScript source code

// 入力情報を表す変数
export let IsRightPressed = false; // 右矢印キーが押されているか
export let IsRightPressedDown = false; // 右矢印キーが押された瞬間か

let PreviousFrameIsRightPressed = false; // 前のフレームでIsRightPressedがtrueだったかを記録する


// ゲームの初期化時に呼び出される関数
// キーが押されたときと、押され終わったときに呼び出される関数を登録する
export function InitInputChecker() {
    // キーが押された瞬間にKeyDownHandlerが呼び出されるようにする
    document.addEventListener("keydown", KeyDownHandler, false);

    // キーが押され終わった瞬間にKeyUpHandlerが呼び出されるようにする
    document.addEventListener("keyup", KeyUpHandler, false);
}

// キーが押されたときに呼び出される関数
function KeyDownHandler(e) {
    // 押されたキーが右矢印キーのとき
    if (e.key == "Right" || e.key == "ArrowRight") {
        IsRightPressed = true;
    }
    //else if (e.key == "Left" || e.key == "ArrowLeft") {
    //    leftPressed = true;
    //}
}

// キーが押され終わったときに呼び出される関数
function KeyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        IsRightPressed = false;
    }
    //else if (e.key == "Left" || e.key == "ArrowLeft") {
    //    leftPressed = false;
    //}
}

// キーの入力情報を更新する関数
export function UpdateInput(){
    // 前のフレームにIsRightPressdがfalseだったら今のフレームで初めてIsRightPressedDownがtrueになったのでtrueにする
    if(IsRightPressed == true && PreviousFrameIsRightPressed == false){
        IsRightPressedDown = true;
    }else{
        IsRightPressedDown = false;
    }

    // このフレームでののIsRightPressedを次フレームに向けて保存しておく
    PreviousFrameIsRightPressed = IsRightPressed;
}
