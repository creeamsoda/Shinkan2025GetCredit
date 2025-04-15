// 単位の状態を表す数を定義したモジュール

// 以下の定数を同じ値にするとゲームが破綻するので気をつけましょう
export const CreditState = Object.freeze({
    StandBy: 0,
    HeldByProfesser: 1,
    Falling: 2,
    CaughtByPlayer: 3,
    FailAndFalling: 4,
    End: 5,
})