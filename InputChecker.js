// 入力情報を表す変数
export let IsKeyPressed = false; // 指定のキーが押されているかを表す
export let IsKeyPressedDown = false; // 指定のキーが押された瞬間か（これは自動で更新するので手動で値を変える必要はないです）

let PreviousFrameIsKeyPressed = false; // 前のフレームでIsKeyPressedがtrueだったかを記録する


// ↓↓ キーの入力を受け付ける処理を書いてみましょう

// キーが押されたときに呼び出される関数
function KeyDownHandler(e) {
    // ↓↓ ここのカッコの中に条件(押されたキーが「自分で決めたキー」と一致しているか)を書きます
    if ( true ) {
        // ここに「自分で決めたキー」が押されたときにすることを書きます
        // このファイルの上の方にいくつか変数がありますね…？
    }
}

// キーが押され終わったときに呼び出される関数
function KeyUpHandler(e) {
    // ↓↓ ここのカッコの中に条件を書きます
    if ( true ) {
        //IsKeyPressed = false;
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
