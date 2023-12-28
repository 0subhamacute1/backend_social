const router = require("express").Router();
const bcrypt = require("bcrypt");
const USER = require("../model/user");
const resHandler = require("../middleware/resHandler");

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
      if (!Number(req.body?.phone)) return resHandler(res, 400, false, "phone empty");
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
    console.log("err 500 signup", err);
    resHandler(res, 500, false, err);
  }
});

router.post("/login", async (req, res) => {
  try {
  } catch (err) {
    console.log("err 500 login", err);
    resHandler(res, 500, false, err);
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
    console.log("err 500 userlist", err);
    resHandler(res, 500, false, err);
  }
});

module.exports = router;
