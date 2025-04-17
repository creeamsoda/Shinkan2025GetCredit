// 単位を生成するモジュール

import { DelaySeconds } from "./Common.js";
import { CreditState } from "./CreditState.js"


// (発展)単位を落とす間隔をランダムにしてみよう
// まだStateがStandBy(=見えていない)の単位を一つ見えるようにする関数
export function SpawnNextCredits(CreditsList, waitSeconds){
    // 単位のリストを上から順番にチェックします
    for (let i=0;i<CreditsList.length; i++){
        // スタンバイ状態（まだ発射されておらず、見えない状態）ではなかったら、リスト中の次の単位をチェックしにforに戻る
        if(CreditsList[i].State != CreditState.StandBy){
            continue;
        }

        // 以下はCreditsList[i]のStateがStandBy状態であるときのみ実行されます

        // 単位を見えるようにする（まだ発射はせず、教授が手に掴んでいる状態）
        CreditsList[i].State = CreditState.HeldByProfesser;

        // 引数で指定された秒後の経過後に落とし始める
        DelaySeconds(waitSeconds).then(function(){ CreditsList[i].State = CreditState.Falling; });

        return;
    }
}