const express = require("express");
// JWT 產生與驗證
const jwt = require("jsonwebtoken");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const User = require("../models/userModel");

// 模組
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// 產生 JWT
const generateSendJWT = async (user, statusCode, res) => {
  // 1.產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  // 2.將最新 token 存入資料庫的 lastToken 欄位
  await User.findByIdAndUpdate(user._id, { lastToken: token });

  // 3.回傳結果給前端
  res.status(statusCode).json({
    status: "success",
    data: {
      token,
      name: user.displayName,
      photo: user.pictureUrl,
    },
    message: "登入成功",
  });
};

// JWT 驗證
const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(appError(401, "您尚未登入！", next));
  }

  // 驗證 token 正確性，並取得 payload 內容(id)
  const decoded = await new Promise((resolve, reject) => {
    // 解密成功會回傳 payload 裡的訊息，失敗(如 Token 被改過或過期、密鑰不正確等)則回傳錯誤
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return next(appError(401, "jwt expired", next));
      } else {
        resolve(payload);
      }
    });
  });
  // 去資料庫確認這個使用者是否存在
  const currentUser = await User.findById(decoded.id);
  // 查詢結果儲存在 currentUser 變數裡
  req.user = currentUser;
  next();
});

module.exports = {
  isAuth,
  generateSendJWT,
};
