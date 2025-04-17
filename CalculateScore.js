import * as GameConst from "./GameConst.js"


// (発展)スコア関数を変えてみよう

export function CalculateScore(Credit){
    // あと何秒でBottomCatchableArea(キャッチできる一番下の点)に到達していたのかを計算する
    let timeUntilReachBottom = CalculateTimeUntilReachLine(Credit, GameConst.BottomCatchableArea);


    // ↓↓ この式を書き換えてみましょう！
    // キャッチ不可までの残り秒数をもとにしたスコアの計算式（感覚でつくりました）
    let calculateResult = - Math.log10(timeUntilReachBottom) + 0.25;


    console.log(calculateResult);
    if (calculateResult < 0){
        calculateResult = 0;
    }

    // 最後にスコアを何倍かして見た目上の大きさを調整する(スコアが大きいほうが興奮しますよね！？)
    calculateResult *= 100;

    // 単位取得ポイントをのせて最終スコアとする
    return calculateResult += GameConst.GetCreditPoint;
}



// 等加速度運動でLineの位置に到達するまでの時間を求める（初速度の向きと加速度の向きがともに正である必要あり）
export function CalculateTimeUntilReachLine(Credit, Line){
    // 現在地からLineまでの距離
    let distanceFromLine = Line - Credit.Position.y;
    // 速度を加速度で割った値、計算中に何度か出てきたので変数にしておく
    let veloDivineAccel = Credit.Velocity.y / GameConst.GravityAcceleration.y;
    
    // 解の公式を変形して所要時間を求める
    return ( - veloDivineAccel
        + Math.sqrt(veloDivineAccel*veloDivineAccel + 2*distanceFromLine/GameConst.GravityAcceleration.y));
}