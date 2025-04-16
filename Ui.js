// UIの基本情報を保持するクラス

export class Ui{
    Text;
    Position;
    Color;
    TextSize;
    Font;

    constructor(Text, Position, Color, TextSize, Font){
        this.Text = Text;
        this.Position = Position;
        this.Color = Color;
        this.TextSize = TextSize;
        this.Font = Font;
    }
}

export class UiSquare{
    Position;
    Color;
    Size;

    constructor(Position, Color, Size){
        this.Position = Position;
        this.Color = Color;
        this.Size = Size;
    }
}