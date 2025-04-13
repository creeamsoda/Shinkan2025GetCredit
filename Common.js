// ベクトルなど便利計算を行うモジュール
// https://qiita.com/Nekonecode/items/523a9e7214082129935e
// ↑このサイトを参考にしました
export class Vector2{
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    sub(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    times(number) {
        return new Vector2(this.x * number, this.y * number);
    }

    divide(number) {
        return new Vector2(this.x / number, this.y / number);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}