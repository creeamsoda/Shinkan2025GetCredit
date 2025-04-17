import { Vector2 } from "./Common.js";

// 灰色の画面のサイズを書いています（ここを書き換えても画面サイズは変わらず、いろんな判定がずれるだけです）
export const WindowSize = new Vector2(1280, 720);

// 主人公などの画像の位置です。画面サイズに合わせて画像を作ったので0,0でぴったりの位置に来ます
export const PlayerPosition = new Vector2(0, 0);

export const CreditStartPosition = new Vector2(520, 85);
export const CreditStartVelocity = new Vector2(0, 0);
export const CreditSize = new Vector2(250,50);
// 単位の色を変えてみましょう！
export const CreditColor = "#C1F109";


// ゲームバランスを調整してみましょう！
export const GravityAcceleration = new Vector2(0, 98);


// (発展)落とす間隔をランダムにしてみよう
export const SpawnCreditsSpan = 2;

export const UpperCatchableArea = 500;
export const BottomCatchableArea = 600;

// 単位を取得したときにタイミングにかかわらずゲットできるポイント
export const GetCreditPoint = 10;
// 単位を落としたときに引かれるポイント
export const FailCreditPoint = -100;


// 教科名を書き換えてみましょう！
export const SubjectsName = ["微分積分学A",
                            "線形代数学A",
                            "物理学基礎論A",
                            "英語リーディング",
                            "英語ライティング・リスニング",
                            "スペイン語(文法)",];