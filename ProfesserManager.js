// 単位を生成するモジュール

import { CreditState } from "./CreditState.js"

// まだStateがStandBy(=見えていない)の単位を一つ見えるようにする関数
export function SpawnNextCredits(CreditsList){
    for (let i=0;i<CreditsList.length; i++){
        if(CreditsList[i].State != CreditState.StandBy){
            continue;
        }

        // CreditsList[i].EnableShow = true;
        // CreditsList[i].EnableMove = true;
        // FIXME 時間差設ける
        CreditsList[i].State = CreditState.HeldByProfesser;
        CreditsList[i].State = CreditState.Falling;
        return;
    }
}