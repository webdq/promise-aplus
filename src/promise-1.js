const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  // 接收 executor 参数
  constructor(executor) {
    // 2.1 promise状态，必须是 pending, fulfilled, rejected 中的一种
    this.state = PENDING;
    // promise 成功的值
    this.value = undefined;
    // promise 失败的原因
    this.reason = undefined;

    // 转为成功态
    const resolve = (value) => {
      // 2.1.1 当状态是 pending 时
      // 2.1.1.1 可以转为成功态或失败态
      if (this.state === PENDING) {
        // 2.1.2 当状态是 fulfilled 时
        // 2.1.2.1 不能再转为其他状态
        this.state = FULFILLED;
        // 2.1.2.2 必须有 value ，并且不能修改
        this.value = value;
      }
    };
    // 转为失败态
    const reject = (reason) => {
      // 2.1.1 当状态是 pending 时
      // 2.1.1.1 可以转为成功态或失败态
      if (this.state === PENDING) {
        // 2.1.3 当状态是 rejected 时
        // 2.1.3.1 不能再转为其他状态
        this.state = REJECTED;
        // 2.1.3.2 必须有 reason，并且不能修改
        this.reason = reason;
      }
    };

    // executor 立即执行，如果抛出错误执行 reject 转为失败态
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  // 2.2 promise 必须有 then 方法，接收 onFulfilled, onRejected 两个参数
  // 2.2.1 onFulfilled, onRejected是可选参数
  // 2.2.5 onFulfilled 和 onRejected 必须作为函数调用
  then(onFulfilled, onRejected) {
    // 2.2.1.1 onFulfilled 如果不是函数必须忽略
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    // 2.2.1.2 onRejected 如果不是函数必须忽略
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 2.2.2 当 onFulfilled 是函数
    // 2.2.2.1 必须在成功态后执行
    // 2.2.2.2 在成功态之前不能执行
    // 2.2.2.3 不能执行多次
    if (this.state === FULFILLED) {
      onFulfilled(this.value);
    }

    // 2.2.3 当 onRejected 是函数
    // 2.2.3.1 必须在失败态后执行
    // 2.2.3.2 在失败态之前不能执行
    // 2.2.3.3 不能执行多次
    if (this.state === REJECTED) {
      onRejected(this.reason);
    }
  }
}

module.exports = Promise;
