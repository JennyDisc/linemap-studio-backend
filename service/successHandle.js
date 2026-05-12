function successHandle(res, message) {
  const responseObject = {
    status: "success",
  };

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
