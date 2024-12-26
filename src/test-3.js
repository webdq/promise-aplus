const Promise = require("./promise-3.js");

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
p1.then(
  (value) => {
    // 链式调用返回 promise
    // 成功的值会传到下一个 then 的 onFulfilled 中
    // 失败的值会传到下一个 then 的 onRejected 中
    return new Promise((resolve, reject) => {
      resolve("100");
      reject("200");
    });
  },
  (reason) => {
    return new Promise((resolve, reject) => {
      resolve("300");
      reject("400");
    });
  }
).then(
  (value) => {
    console.log("p1 成功回调", value);
  },
  (reason) => {
    console.log("p1 失败回调", reason);
  }
);

// promise2 和 x 链式循环
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
const p3 = p2.then().then(() => {
  return p3;
});
p3.then(
  (value) => {
    console.log("p3 ", value);
  },
  (reason) => {
    console.log("p3 ", reason);
  }
);

const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
p4.then(() => {
  // 链式调用返回普通值
  return 1;
}).then((value) => {
  console.log("p4 ", value);
});

const p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
p5.then(() => {
  // 链式调用抛出错误
  throw new Error("抛出错误");
}).then(null, (reason) => {
  console.log("p5 ", reason);
});
