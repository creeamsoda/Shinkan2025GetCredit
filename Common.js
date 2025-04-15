// ベクトルなど便利計算やディレイ処理を行うモジュール

// ベクトルの定義
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


// ディレイ処理
// https://qiita.com/Hirohana/items/6a7fd4c7f4c9ccb1f6da
// ↑このサイトを参考にしました
export async function DelaySeconds(seconds, cancellationToken){
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, seconds*1000);
        if (cancellationToken){
            cancellationToken.register(reject);
        }
    });
}