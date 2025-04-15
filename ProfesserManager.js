// 単位を生成するモジュール

import { DelaySeconds } from "./Common.js";
import { CreditState } from "./CreditState.js"

// まだStateがStandBy(=見えていない)の単位を一つ見えるようにする関数
export function SpawnNextCredits(CreditsList){
    for (let i=0;i<CreditsList.length; i++){
        if(CreditsList[i].State != CreditState.StandBy){
            continue;
        }

        // 単位を見えるようにする
        CreditsList[i].State = CreditState.HeldByProfesser;

        // 1秒後に落とし始める
        DelaySeconds(1).then(function(){ CreditsList[i].State = CreditState.Falling; });

        return;
    }
}