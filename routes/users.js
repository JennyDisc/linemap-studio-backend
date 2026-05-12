const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");

// 登入
// router.post("/login/line", handleErrorAsync(UserController.lineLogin));
router.post(
  "/login/line",
  handleErrorAsync(async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Line Login 登入'
    // #swagger.description = '前端傳入 Line ID Token，後端驗證後核發系統 JWT'
    /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Line 驗證資訊',
      required: true,
      schema: { $id_token: 'ID Token' }
  } */
    UserController.lineLogin(req, res, next);
  }),
);
// 取得目前登入者資料 (需要 token)
// router.get("/getUser", isAuth, handleErrorAsync(UserController.getUser));
router.get(
  "/getUser",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = '取得使用者資料'
    // #swagger.description = '取得目前登入使用者的資料'
    // #swagger.security = [{ "Bearer": [] }]
    UserController.getUser(req, res, next);
  }),
);

// 檢查是否為頻道好友 (需要 token)
// router.get(
//   "/check-friendship",
//   isAuth,
//   handleErrorAsync(UserController.checkFriendship),
// );
router.get(
  "/check-friendship",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = '檢查頻道好友狀態'
    // #swagger.description = '確認使用者是否已加入官方帳號好友且未封鎖'
    // #swagger.security = [{ "Bearer": [] }]
    UserController.checkFriendship(req, res, next);
  }),
);

module.exports = router;
