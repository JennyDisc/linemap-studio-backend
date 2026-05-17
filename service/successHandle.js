function successHandle(res, data, message) {
  const responseObject = {
    status: "success",
  };

  // 如果有傳入 data 才會包進回應中
  if (data) {
    responseObject.data = data;
  }

  // 如果有傳入 message 才會包進回應中
  if (message) {
    responseObject.message = message;
  }

  if (data) {
    responseObject.data = data;
  }

  // 回傳成功預設狀態200，這邊還是寫出來
  res.status(200).send(responseObject);
}

module.exports = successHandle;
