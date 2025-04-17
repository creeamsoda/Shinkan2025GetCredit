// 単位をまとめ、動かしたり、表示と非表示を切り替えたりするモジュール

import * as GameConst from "./GameConst.js";
import { Credit } from "./Credit.js";


export class CreditManager{
    static CreditsList = [];

    // 初期化のときに教科名のリストから単位を生成する
    static{
        for (let i=0; i<GameConst.SubjectsName.length; i++){
            this.CreditsList.push(new Credit(GameConst.SubjectsName[i], GameConst.CreditStartPosition, GameConst.CreditStartVelocity));
        } 
    }



    // 単位を等加速度直線運動させましょう
    // 単位を動かす関数
    static MoveShowingCredits(deltaSeconds){
        for (let i=0; i<this.CreditsList.length; i++){
            if (this.CreditsList[i].IsMoving() == true){
                // ↓↓ ちょっと記法が独特なのでここに例を書きます ↓↓

                // A, B, Cはベクトル、Rは普通の数（スカラー）
                // 「A = A + B」をしたいときは「A = A.add(B)」
                // 「A = A * R」なら「A = A.times(R)」
                // 組み合わせ「A = A + B*R + C」は「A = A.add( B.times(R) ).add(C)」

                // スカラー同士の計算は普通に*とか+とか-とかを使ってください


                // 使える数（コピペして使いましょう）
                // ↓ 単位の座標（ベクトル）
                // this.CreditsList[i].Position
                // ↓ 単位の速度（ベクトル）
                // this.CreditsList[i].Velocity
                // ↓ 加速度（ベクトル）
                // GameConst.GravityAcceleration
                // ↓ フレーム間の経過時間（スカラー）
                // deltaSeconds

                // ↓↓ ここから


                // ↑↑ ここの間に書いていきましょう
            }
        }
    }
}

