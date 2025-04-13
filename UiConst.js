// UIの位置などを指定するモジュール

import { Vector2 } from "./Common.js";
import { Ui } from "./Ui.js";

export const ScoreText = new Ui("Score:", new Vector2(1000, 600), "black", "20px", "Arial");
export const ScoreNumber = new Ui("", new Vector2(1100, 600), "red", "50px", "Arial");