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
    // 成功的回调
    this.onFulfilledCallbacks = [];
    // 失败的回调
    this.onRejectedCallbacks = [];

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
        // 2.2.6.1 当 promise 是成功态，依次执行成功的回调
        this.onFulfilledCallbacks.forEach((fn) => fn());
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
        // 2.2.6.2 当 promise 是失败态，依次执行失败的回调
        this.onRejectedCallbacks.forEach((fn) => fn());
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
  // 2.2.6 同一个 promise 可以执行多次 then 方法
  then(onFulfilled, onRejected) {
    // 2.2.1.1 onFulfilled 如果不是函数必须忽略
    // 2.2.7.3 当 onFulfilled 不是函数，promise1 成功态，promise2 也必须是成功态
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    // 2.2.1.2 onRejected 如果不是函数必须忽略
    // 2.2.7.4 当 onRejected 不是函数，promise1 失败态，promise2 也必须是失败态
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new Promise((resolve, reject) => {
      // 2.2.2 当 onFulfilled 是函数
      // 2.2.2.1 必须在成功态后执行
      // 2.2.2.2 在成功态之前不能执行
      // 2.2.2.3 不能执行多次
      if (this.state === FULFILLED) {
        // 2.2.4 onFulfilled 或 onRejected 不能执行在当前上下文中
        // 使用宏任务 setTimeout / setImmediate 或者 微任务 MutationObserver / process.nextTick
        setTimeout(() => {
          try {
            // 2.2.7.1 onFulfilled 或 onRejected 的返回值 x，执行 resolvePromise 函数
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            // 2.2.7.2 onFulfilled 或 onRejected 抛出异常，promise2 必须失败
            reject(e);
          }
        });
      }

      // 2.2.3 当 onRejected 是函数
      // 2.2.3.1 必须在失败态后执行
      // 2.2.3.2 在失败态之前不能执行
      // 2.2.3.3 不能执行多次
      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      // 当 promise 异步时，状态还没有立即改变，不能直接执行回调，而且 promise 可以多次调用 then 方法，
      // 所以先把 onFulfilled 和 onRejected 存到 onFulfilledCallbacks / onRejectedCallbacks 数组里
      // 当 promise 状态改变时，再依次执行回调集合里的方法

      if (this.state === PENDING) {
        // 存入成功的回调
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        // 存入失败的回调
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    // 2.2.7 then 方法必须返回一个 promise
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 2.3.1 如果 promise2 和 x 指向同一个对象，让 promise2 失败，new TypeError 作为失败的原因
  if (promise2 === x) {
    return reject(new TypeError("链式循环引用"));
  }
  // 2.3.2 如果 x 是一个 promise，采用他的状态
  // 2.3.2.1 当 x 是 pending 状态，让 promise2 等待 x 成功或失败
  // 2.3.2.2 当 x 成功了，让 promise2 也成功
  // 2.3.2.3 当 x 失败了，让 promise2 也失败
  // 2.3.3 如果 x 是一个 object 或 function
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // 2.3.3.3.3 防止 resolvePromise 或 rejectPromise 多次调用
    let called = false;
    try {
      // 2.3.3.1 声明 then
      let then = x.then;
      // 2.3.3.3 如果 then 是函数就执行它，并把 this 指向 x
      if (typeof then === "function") {
        // 2.3.3.3.1 resolvePromise 成功回调接收参数 y
        // 2.3.3.3.2 rejectPromise 失败回调接收参数 r
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            // 2.3.3.3.1 递归解析
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // 2.3.3.4 如果 then 不是函数，让 promise2 成功，x 作为成功的值
        resolve(x);
      }
    } catch (e) {
      // 2.3.3.3.4 当执行 then 抛出异常
      // 2.3.3.3.4.1 当 resolvePromise 或 rejectPromise 已经执行了，直接返回
      // 2.3.3.3.4.2 否则让 promise2 失败
      if (called) return;
      called = true;
      // 2.3.3.2 获取 then 时抛出异常，让 promise2 失败，e 作为失败的原因
      reject(e);
    }
  } else {
    // 2.3.4 如果 x 不是 object 或 function，让 promise2 成功，x 作为成功的值
    resolve(x);
  }
}

module.exports = Promise;
