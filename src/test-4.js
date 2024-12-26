const Promise = require("./promise-4.js");

// 传入普通值
Promise.resolve("success").then((value) => {
  console.log("成功 ", value);
});

Promise.reject("fail").then(null, (reason) => {
  console.log("失败 ", reason);
});

// 传入 promise
Promise.resolve(
  new Promise((resolve, reject) => {
    resolve("success");
  })
).then((value) => {
  console.log("promise成功 ", value);
});

// 传入 promise
Promise.reject(
  new Promise((resolve, reject) => {
    reject("fail");
  })
).then(null, (reason) => {
  console.log("promise失败 ", reason);
});
