const resHandler = (res, code, isSuccess, msg, data) => {
  try {
    return res.status(code).send({
      success: isSuccess,
      msg: msg ? msg : "no msg",
      data: data ? data : "",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: "internal server err",
      data: error,
    });
  }
};

module.exports = resHandler;
