const Promise = require("./promise-2.js");

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
p1.then(
  (value) => {
    console.log("p1 成功回调1", value);
  },
  (reason) => {
    console.log("p1 失败回调1", reason);
  }
);
p1.then(
  (value) => {
    console.log("p1 成功回调2", value);
  },
  (reason) => {
    console.log("p1 失败回调2", reason);
  }
);
