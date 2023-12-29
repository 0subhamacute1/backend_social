const router = require("express").Router();
const bcrypt = require("bcrypt");
const USER = require("../model/user");
const resHandler = require("../middleware/resHandler");
const verifyToken = require("../middleware/verifyToken");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;

//res, code, isSuccess, msg, data
router.post("/create", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    let exist = await USER.findOne({ name: req.body?.name });

    if (exist) {
      resHandler(res, 400, false, "user already exist");
    } else {
      if (!req.body?.name) return resHandler(res, 400, false, "name empty");
      if (!Number(req.body?.phone))
        return resHandler(res, 400, false, "phone empty");
      if (!req.body?.password)
        return resHandler(res, 400, false, "password empty");

      let data = {
        name: req.body.name,
        phone: Number(req.body.phone),
        password: hashPass,
      };
      let result = await USER.create(data);
      resHandler(res, 200, true, "user created", result);
    }
  } catch (err) {
    resHandler(res, 500, false, "internal server error", err);
  }
});

router.get("/userlist", async (req, res) => {
  try {
    USER.find()
      .then((users) => {
        resHandler(res, 200, true, "userlist", users);
      })
      .catch((err) => {
        resHandler(res, 500, false, err);
      });
  } catch (err) {
    resHandler(res, 500, false, "internal server error", err);
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body?.name) return resHandler(res, 400, false, "name empty");
    if (!req.body?.password)
      return resHandler(res, 400, false, "password empty");

    const user = await USER.findOne({ name: req.body.name });
    if (user) {
      const validPass = await bcrypt.compare(req.body.password, user.password);

      if (validPass) {
        jwt.sign({ user }, jwtKey, (err, token) => {
          if (err) {
            resHandler(res, 400, false, "token not generated", err);
          } else {
            resHandler(res, 200, false, "login successful", {user,token});
          }
        });
      } else {
        resHandler(res, 400, false, "wrong password");
      }
    } else {
      resHandler(res, 400, false, "user not found");
    }
  } catch (err) {
    resHandler(res, 500, false, "internal server error", err);
  }
});

router.get("/userbyid/:id", async (req, res) => {
  console.log("req.params", req.params);
  try {
    const user = await USER.findOne({ _id: req.params.id });
    if (!user) return resHandler(res, 400, false, "user not found");
    resHandler(res, 200, true, "user found", user);
  } catch (err) {
    resHandler(res, 500, false, "internal server error", err);
  }
});

router.post("/generateToken", async (req, res) => {
  try {
    let data = {
      name: req.body.name,
      password: req.body.password,
    };

    jwt.sign(data, jwtKey, (err, token) => {
      if (err) {
        resHandler(res, 400, false, "token not generated", err);
      } else {
        resHandler(res, 200, false, "token  generated", { token });
      }
    });
  } catch (err) {
    resHandler(res, 500, false, "internal server error", err);
  }
});

router.post("/validateToken", verifyToken, async (req, res) => {
  try {
    let jwtKey = process.env.JWT_KEY;
    jwt.verify(req.token, jwtKey, (err, authData) => {
      if (err) {
        resHandler(res, 403, false, "auth fail", err);
      } else {
        resHandler(res, 200, true, "auth success", authData);
      }
    });
  } catch (err) {
    resHandler(res, 500, false, "internal server error validateToken", err);
  }
});

module.exports = router;
