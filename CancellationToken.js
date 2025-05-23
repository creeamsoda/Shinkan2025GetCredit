// 非同期処理をキャンセルするのに使うクラス
// https://qiita.com/sukobuto/items/298de3f97c0862aa8c3c
// ↑をコピペさせていただいた

export class CancellationToken {

    isCancellationRequested = false;
  
    constructor(parentToken = null) {
      this.cancellationPromise = new Promise(resolve => {
        this.cancel = e => {
          this.isCancellationRequested = true;
          if (e) {
            resolve(e);
          } else {
            var err = new Error("cancelled");
            err.cancelled = true;
            resolve(err);
          }
        }
      });
      if (parentToken && parentToken instanceof CancellationToken) {
        parentToken.register(this.cancel);
      }
    }
  
    register(callback) {
      this.cancellationPromise.then(callback);
    }
  
    createDependentToken() {
      return new CancellationToken(this);
    }
  
  }
  