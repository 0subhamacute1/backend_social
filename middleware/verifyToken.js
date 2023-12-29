const verifyToken = (req, res, next) => {
    const auth = req.headers["authorization"];
    if (!auth) return resHandler(res, 500, false, "no auth found");
    let token = auth.split(" ")[1];
    req.token = token;
    next();
  };

  module.exports = verifyToken