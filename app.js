// 載入 node.js 模組
const express = require("express");
// 處理檔案路徑的工具(確保在不同作業系統路徑都正確)
const path = require("path");
// 解析瀏覽器傳來的 Cookie
const cookieParser = require("cookie-parser");
// 日誌工具，會在終端機印出 API 被呼叫的紀錄(HTTP request logger)
const logger = require("morgan");
// 跨域套件
const cors = require("cors");
const errorHandle = require("./service/errorHandle");
require("./connections/index");
// 載入 Swagger 自動產生文件的工具
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

// node.js 提供的"預期外的錯誤"
// 當程式遇到未捕捉的異常時就會被觸發，即捕捉同步的程式錯誤
// 如程式碼錯誤，如呼叫的函式內故意使用未定義的變量就會引發異常
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaughted Exception！");
  console.error(err);
  process.exit(1);
});

// 路由設定
const usersRouter = require("./routes/users");

// 建立並使用 express
const app = express();

// app.use 請求進來後會依序經過這些處理
// 使用 express 功能
// 在開發模式下，將 API 的連線狀態印在終端機上，方便除錯(如404、500等錯誤)
app.use(logger("dev"));
// 跨域(允許所有來源連線)
app.use(cors());
// 解析 json 格式(當前端用 JSON 格式傳資料時，這行會幫你把資料轉成 JavaScript 物件)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 載入 cookie 的解析
app.use(cookieParser());
// 設定靜態檔案路徑：當前端有存放在 public 資料夾的圖片或 CSS，可以直接透過網址讀取
app.use(express.static(path.join(__dirname, "public")));
// '/api-doc'：自訂的網址路徑，瀏覽器輸入 https://linemap-studio-backend.onrender.com/api-doc 就能看文件
// swaggerUi.serve：由 swagger-ui-express 提供，負責準備好顯示文件需要的靜態檔案（如 CSS/JS）
// swaggerUi.setup(swaggerFile)：在 swagger-output.json 裡的內容給 UI，讓它渲染成網頁
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 路由設計
app.use("/users", usersRouter);

// 404 路由錯誤
app.use(function (req, res, next) {
  errorHandle(res, 404, "error", "無此頁面資訊", null);
});

// 正式環境 production 錯誤
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    errorHandle(res, err.statusCode, err.status, err.message, null);
  } else {
    console.error("出現重大錯誤", err);
    // 送出罐頭預設訊息
    errorHandle(res, 500, "error", "系統錯誤，請恰系統管理員", null);
  }
};

// 開發環境 development 錯誤
// 所有開發環境( npm run start:dev )中的錯誤都會由這邊錯誤處理
const resErrorDev = (err, res) => {
  errorHandle(res, err.statusCode, err, err.message, err.stack);
};

// 處理錯誤(如程式撰寫錯誤、try catch 的 catch 錯誤)
app.use(function (err, req, res, next) {
  if (err.name === "ValidationError" || err.message === "File too large") {
    err.statusCode = err.statusCode || 400;
  } else {
    err.statusCode = err.statusCode || 500;
  }
  // 開發環境 development
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }
  // 正式環境 production
  // isAxiosError 是 axios 套件提供的錯誤屬性
  if (err.isAxiosError === true) {
    err.message = "axios 連線錯誤";
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  // ValidationError 是 mongoose 驗證產生的相關錯誤
  else if (err.name === "ValidationError") {
    // mongoose 資料辨識錯誤
    err.message = "登入資訊不正確！";
    err.isOperational = true;
    err.statusCode = 400;
    return resErrorProd(err, res);
  }
  // SyntaxError 資料格式錯誤
  // POST 與 PATCH API，body 寫 "content":
  else if (err.name === "SyntaxError") {
    err.message = "資料格式錯誤";
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  // 自訂上傳圖片檔案限制的錯誤回傳
  else if (err.message === "File too large") {
    err.message = "圖片檔案不得超過2MB";
    err.isOperational = true;
    err.statusCode = 400;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
});

// node.js 提供的"預期外的錯誤"
// 如處理非同步程式沒有加上 catch 捕捉，錯誤就會觸發
process.on("unhandledRejection", (err, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", err);
});

// 將 app 物件匯出，讓 bin/www 這個啟動檔可以載入並執行監聽(Listen)
module.exports = app;
