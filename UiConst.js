// UIの位置などを指定するモジュール

import { Vector2 } from "./Common.js";
import { Ui } from "./Ui.js";

const DefaultFont = "Arial";

export const ScoreText = new Ui("Score:", new Vector2(1000, 600), "black", "20px", DefaultFont);
export const ScoreNumber = new Ui("", new Vector2(1100, 600), "red", "50px", DefaultFont);

export const GetCreditText = new Ui("得単", new Vector2(1000,400), "red", "100px", DefaultFont);
export const FailCreditText = new Ui("落単", new Vector2(1000, 400), "blue", "100px", DefaultFont);

export const ScoreIncreaseText = new Ui("+", new Vector2(1000,500), "red", "70px", DefaultFont);
export const ScoreDecreaseText = new Ui("-", new Vector2(1000,500), "blue", "70px", DefaultFont);