// 単位の位置や速度を保持するクラス

import { CreditState } from "./CreditState.js"

export class Credit{
    Name;
    Position;
    Velocity;
    EnableShow;
    EnableMove;
    State;

    constructor(name, position, velocity){
        this.Name = name;
        this.Position = position;
        this.Velocity = velocity;

        this.EnableShow = false;
        this.EnableMove = false;
        this.State = CreditState.StandBy;
    }

    IsShowing(){
        return (this.State == CreditState.HeldByProfesser
            || this.State == CreditState.Falling
            || this.State == CreditState.CaughtByPlayer
            || this.State == CreditState.FailAndFalling)
    }

    IsMoving(){
        return (this.State == CreditState.Falling
            || this.State == CreditState.FailAndFalling)
    }
}