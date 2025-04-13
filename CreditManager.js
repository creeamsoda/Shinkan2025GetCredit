// 単位をまとめ、動かしたり、表示と非表示を切り替えたりするモジュール

import * as GameConst from "./GameConst.js";
import { Credit } from "./Credit.js";
import { CreditState } from "./CreditState.js"

export class CreditManager{
    static CreditsList = [];

    // 教科
    static{
        for (let i=0; i<GameConst.SubjectsName.length; i++){
            this.CreditsList.push(new Credit(GameConst.SubjectsName[i], GameConst.CreditStartPosition, GameConst.CreditStartVelocity));
        } 
    }

    static MoveShowingCredits(deltaTime){
        for (let i=0; i<this.CreditsList.length; i++){
            if (this.CreditsList[i].State == CreditState.Falling){
                // 移動距離 = 速度*時間 + 加速度*0.5*時間*時間
                this.CreditsList[i].Position = this.CreditsList[i].Position
                    .add(this.CreditsList[i].Velocity.times(deltaTime))
                    .add(GameConst.GravityAcceleration.times(0.5*deltaTime*deltaTime));
                
                // 速度 = 速度 + 加速度*時間
                this.CreditsList[i].Velocity = this.CreditsList[i].Velocity
                    .add(GameConst.GravityAcceleration.times(deltaTime));
            }
        }
    }
}

