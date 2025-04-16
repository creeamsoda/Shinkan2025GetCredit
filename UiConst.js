// UIの位置などを指定するモジュール

import { Vector2 } from "./Common.js";
import { Ui, UiSquare } from "./Ui.js";

const DefaultFont = "Arial";

export const CreditNameText = new Ui("", null, "black", "30px", DefaultFont);

export const ScoreText = new Ui("Score:", new Vector2(1000, 600), "black", "20px", DefaultFont);
export const ScoreNumber = new Ui("", new Vector2(1100, 600), "red", "50px", DefaultFont);

export const GetCreditText = new Ui("得単", new Vector2(1000,400), "red", "100px", DefaultFont);
export const FailCreditText = new Ui("落単", new Vector2(1000, 400), "blue", "100px", DefaultFont);

export const ScoreIncreaseText = new Ui("+", new Vector2(1000,500), "red", "70px", DefaultFont);
export const ScoreDecreaseText = new Ui("-", new Vector2(1000,500), "blue", "70px", DefaultFont);

export const ResultBackground = new UiSquare(new Vector2(150,100), "white", new Vector2(1000, 600));
export const GradeText = new Ui("成績", new Vector2(550, 200), "black", "70px", DefaultFont);
export const ResultCreditNameText = new Ui("", null, "black", "50px", DefaultFont);
export const ResultGetCreditText = new Ui("取得した単位 : ", new Vector2(200, 300), "black", "50px", DefaultFont);
export const ResultFailCreditText = new Ui("落とした単位 : ", new Vector2(200, 450), "black", "50px", DefaultFont);
export const ResultScoreText = new Ui("スコア : ", new Vector2(300, 650), "black", "70px", DefaultFont);