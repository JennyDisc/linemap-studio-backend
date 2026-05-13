const mongoose = require("mongoose");
const User = require("../models/userModel");
const successHandle = require("../service/successHandle");
const appError = require("../service/appError");
const { generateSendJWT } = require("../service/auth");
const axios = require("axios");

const userController = {
  // 登入
  async lineLogin(req, res, next) {
    const { id_token } = req.body;

    // 1.驗證前端是否有傳 id_token
    if (!id_token) {
      return next(appError(400, "缺少 Line 驗證碼 (ID Token)"));
    }

    try {
      // 2.呼叫 line api 驗證 id_token 並取得使用者資料
      const lineResponse = await axios.post(
        "https://api.line.me/oauth2/v2.1/verify",
        new URLSearchParams({
          id_token: id_token,
          client_id: process.env.LINE_CHANNEL_ID,
        }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      // 解構 line 回傳的資訊
      const {
        sub: lineUserId,
        name: displayName,
        picture: pictureUrl,
      } = lineResponse.data;

      // 3.尋找使用者，如果不存在就建立，存在就更新
      const user = await User.findOneAndUpdate(
        { lineUserId },
        { displayName, pictureUrl },
        { upsert: true, new: true, runValidators: true },
      );

      // 4.產生系統自己的 JWT 並存入 lastToken
      generateSendJWT(user, 200, res);
    } catch (error) {
      // 如果 Line 伺服器回報 id_token 錯誤或過期
      return next(appError(401, "Line 身分驗證失敗，請重新登入"));
    }
  },

  // 取得目前登入者資料
  async getUser(req, res) {
    // isAuth 已經將當前使用者找出並存在 req.user
    const { _id, displayName, pictureUrl, lineUserId, createdAt } = req.user;
    successHandle(
      res,
      { _id, displayName, pictureUrl, lineUserId, createdAt },
      "成功取得使用者資料",
    );
  },

  // 檢查是否為頻道好友
  async checkFriendship(req, res, next) {
    try {
      // 1.從 .env 取得 Messaging API 的 Access Token
      const ACCESS_TOKEN = process.env.LINE_MESSAGING_ACCESS_TOKEN;

      // 2.呼叫 Line API 檢查狀態
      const response = await axios.get(
        `https://api.line.me/v2/bot/friendship/status?userId=${req.user.lineUserId}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        },
      );

      const isFriend = response.data.friend;

      if (isFriend) {
        successHandle(res, { isFriend: true }, "使用者已加入好友");
      } else {
        successHandle(res, { isFriend: false }, "請先加入官方帳號好友");
      }
    } catch (error) {
      return next(appError(500, "檢查好友狀態失敗"));
    }
  },
};

module.exports = userController;
