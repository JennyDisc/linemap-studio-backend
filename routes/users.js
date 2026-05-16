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
    // #swagger.description = '接收前端從 LINE 取得的 Authorization Code，後端驗證後核發系統 JWT'

    /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Line 登入所需資訊',
      required: true,
      schema: { $code: 'string' }
    } */

    /* #swagger.responses[200] = { 
        description: '登入成功',
        schema: { 
            status: 'success',
            message: '登入成功',
            data: {
                token: 'eyJhbGciOiJIUzI1...',
                name: '小明',
                photo: 'https://example.com/photo.jpg'
            }
        } 
    } */

    /* #swagger.responses[400] = { 
        description: '請求格式錯誤',
        schema: { 
            status: 'false',
            message: '缺少 Line 驗證碼 (ID Token)'
        } 
    } */

    /* #swagger.responses[401] = { 
        description: 'LINE 驗證失敗',
        schema: { 
            status: 'false',
            message: 'Line 身分驗證失敗，請重新登入'
        } 
    } */

    UserController.lineLogin(req, res, next);
  }),
);

// 取得目前登入者資料(需要 token)
// router.get("/getUser", isAuth, handleErrorAsync(UserController.getUser));
router.get(
  "/getUser",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = '取得使用者資料'
    // #swagger.description = '取得目前登入使用者的資料'
    // #swagger.security = [{ "Bearer": [] }]

    /* #swagger.responses[200] = { 
        description: '成功取得資料',
        schema: { 
            status: 'success',
            message: '成功取得使用者資料',
            data: {
                _id: '6641ab...',
                displayName: '小明',
                pictureUrl: 'https://example.com/photo.jpg',
                lineUserId: 'U123456...',
                createdAt: '2026-05-13T09:00:00.000Z',
            }
        } 
    } */

    /* #swagger.responses[401] = { 
        description: '身分驗證失敗',
        schema: { 
            status: 'false',
            message: '您尚未登入！'
        } 
    } */
    UserController.getUser(req, res, next);
  }),
);

// 檢查是否為頻道好友(需要 token)
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

    /* #swagger.responses[200] = { 
        description: '成功取得好友狀態(包含是好友與非好友的情境。message 會不同，但 schema 結構相同)',
        schema: { 
            status: 'success',
            message: '使用者已加入好友',
            data: {
                isFriend: true
            }
        } 
    } */

    /* #swagger.responses[401] = { 
        description: '身分驗證失敗',
        schema: { 
            status: 'false',
            message: '您尚未登入！'
        } 
    } */

    /* #swagger.responses[500] = { 
        description: '伺服器內部錯誤 (LINE API 呼叫失敗)',
        schema: { 
            status: 'false',
            message: '檢查好友狀態失敗'
        } 
    } */
    UserController.checkFriendship(req, res, next);
  }),
);

module.exports = router;
