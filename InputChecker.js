// 入力情報を表す変数
export let IsKeyPressed = false; // 右矢印キーが押されているか
export let IsKeyPressedDown = false; // 右矢印キーが押された瞬間か

let PreviousFrameIsKeyPressed = false; // 前のフレームでIsRightPressedがtrueだったかを記録する


// ↓↓ キーの入力を受け付ける処理を書いてみましょう

// キーが押されたときに呼び出される関数
function KeyDownHandler(e) {
    // 押されたキーがスペースキーのとき
    if (e.key == " ") {
        IsKeyPressed = true;
    }
}

// キーが押され終わったときに呼び出される関数
function KeyUpHandler(e) {
    if (e.key == " ") {
        IsKeyPressed = false;
    }
}

// ↑↑ キーの入力を受け付ける処理を書いてみましょう



// ゲームの初期化時に呼び出される関数
// キーが押されたときと、押され終わったときに呼び出される関数を登録する
export function InitInputChecker() {
    // キーが押された瞬間にKeyDownHandlerが呼び出されるようにする
    document.addEventListener("keydown", KeyDownHandler, false);

    // キーが押され終わった瞬間にKeyUpHandlerが呼び出されるようにする
    document.addEventListener("keyup", KeyUpHandler, false);
}


// キーの入力情報を更新する関数
export function UpdateInput(){
    // 前のフレームにIsRightPressdがfalseだったら今のフレームで初めてIsRightPressedDownがtrueになったのでtrueにする
    if(IsKeyPressed == true && PreviousFrameIsKeyPressed == false){
        IsKeyPressedDown = true;
    }else{
        IsKeyPressedDown = false;
    }

    // このフレームでののIsRightPressedを次フレームに向けて保存しておく
    PreviousFrameIsKeyPressed = IsKeyPressed;
}
