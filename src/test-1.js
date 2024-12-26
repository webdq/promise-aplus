const Promise = require("./promise-1.js");

const p1 = new Promise((resolve, reject) => {
  resolve("success");
});
p1.then((value) => {
  console.log("p1 成功回调", value);
});

const p2 = new Promise((resolve, reject) => {
  reject("fail");
});
p2.then(null, (reason) => {
  console.log("p2 失败回调", reason);
});

const p3 = new Promise((resolve, reject) => {
  throw new Error("error");
});
p3.then(null, (reason) => {
  console.log("p3 失败回调", reason);
});
