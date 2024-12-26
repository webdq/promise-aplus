const Promise = require("./promise-6.js");

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(100);
  }, 1000);
});

p1.catch((reason) => {
  console.log("catch 失败 ", reason);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(200);
  }, 1000);
});

p2.finally(() => {
  console.log("finally 成功或失败都会执行");
}).then(
  (value) => {
    console.log("p2 成功 ", value);
  },
  (reason) => {
    console.log("p2 失败 ", reason);
  }
);
