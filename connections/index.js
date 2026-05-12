const mongoose = require("mongoose");

// 模組
const dotenv = require("dotenv");
// 載入環境變數
dotenv.config({ path: "./config.env" });
// 連接資料庫
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD,
);

// 連接 mongodb 的 DB 這個資料庫
mongoose
  .connect(DB)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports;
