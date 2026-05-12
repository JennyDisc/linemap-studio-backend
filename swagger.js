const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Line Map Studio API",
    description: "選單地圖工具 API 文件",
  },
  host: "linemap-studio-backend.onrender.com",
  schemes: ["http"],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "請加上 Bearer 前綴，例如：Bearer <TOKEN>",
    },
  },
};

const outputFile = "./swagger-output.json"; // 輸出的 JSON 檔名
const endpointsFiles = ["./app.js"]; // 掃描的進入點(從 app.js 開始找所有路由)

swaggerAutogen(outputFile, endpointsFiles, doc);
