const Promise = require("./promise-5.js");

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100);
  }, 1000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(200);
  }, 2000);
});

Promise.race([p1, p2]).then(
  (value) => {
    console.log("race 成功 ", value);
  },
  (reason) => {
    console.log("race 失败 ", reason);
  }
);

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(300);
  }, 1000);
});
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(400);
  }, 2000);
});

Promise.all([p3, p4]).then(
  (value) => {
    console.log("all 成功 ", value);
  },
  (reason) => {
    console.log("all 失败 ", reason);
  }
);
