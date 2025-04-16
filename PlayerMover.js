// JavaScript source code
// 主人公の動きを扱うモジュール

export const PlayerState = Object.freeze({
    Sleeping: 0,
    ExtendingHandHappy: 1,
    ExtendingHandSad: 2,
})

export let NowPlayer = PlayerState.Sleeping;


// ボタン入力に応じて主人公の手を伸ばす関数。手を伸ばせたらtrue、すでに伸ばしていたり、伸ばさなかったらfalseを返す
export function TryPlayerExtendHandHappy(IsButtonPressedDown) {
    // ボタンが押されたのなら手を伸ばす
    if (IsButtonPressedDown == true) {
        NowPlayer = PlayerState.ExtendingHandHappy;
        return true;
    }

    return false;
}

export function TryPlayerExtendHandSad(IsButtonPressedDown){
    if(IsButtonPressedDown == true){
        NowPlayer = PlayerState.ExtendingHandSad;
        return true;
    }
    return false;
}

// 主人公の手を引っ込める関数
export function SleepPlayer(){
    NowPlayer = PlayerState.Sleeping
}