// JavaScript source code
// 主人公の動きを扱うモジュール

export let IsPlayerExtendingHand = false; // 手を伸ばしているか

// ボタン入力に応じて主人公の手を伸ばす関数。手を伸ばせたらtrue、すでに伸ばしていたり、伸ばさなかったらfalseを返す
export function TryPlayerExtendHand(IsButtonPressedDown) {
    // ボタンが押されたのなら手を伸ばす
    if (IsButtonPressedDown == true) {
        IsPlayerExtendingHand = true;
        return true;
    }

    return false;
}

// 主人公の手を引っ込める関数
export function SleepPlayer(){
    IsPlayerExtendingHand = false;
}