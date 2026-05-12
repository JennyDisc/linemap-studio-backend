const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    lineUserId: {
      type: String,
      required: true,
      unique: true,
    },
    // 使用者的暱稱
    displayName: {
      type: String,
    },
    // 使用者的大頭照
    pictureUrl: {
      type: String,
    },
    // 創建使用者的時間戳記
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // 最後一次使用的 token
    lastToken: {
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

// 建立 model
const User = mongoose.model("user", userSchema);

module.exports = User;
