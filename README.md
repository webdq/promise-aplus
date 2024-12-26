## Promises/A+

## 专业术语

1.1 `promise` 是一个 object 对象或者 function 函数

1.2 `thenable` 是一个 object 对象或者 function 函数并且有 then 方法

1.3 `value` 是任意合法的 JavaScript 值，包括 undefined / thenable / promise

1.4 `exception` 使用 throw 抛出的异常

1.5 `reason` 表示 promise 失败的值

## promise 状态

- promise 状态只能是 `pending`, `fulfilled`, `rejected` 的一种

- 当 promise 是 pending 时，可以转为 fulfilled 或者 rejected

- 当 promise 是 fulfilled 时，不能再转为其他状态，必须有 `value` ，并且不能修改

- 当 promise 是 rejected 时，不能再转为其他状态，必须有 `reason` ，并且不能修改

## 实现基本的 promise

> ./src/promise-1.js

## 实现异步的 promise

> ./src/promise-2.js

## promise 的链式调用

> ./src/promise-3.js

## resolve、reject 静态方法

> ./src/promise-4.js

## race、all 静态方法

> ./src/promise-5.js

## catch、finally 方法

> ./src/promise-6.js

## 完整的代码

> promise.js
