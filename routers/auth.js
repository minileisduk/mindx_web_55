const express = require("express");
const AuthCtrl = require("../controllers/AuthController");

const router = express.Router();

router.post("/login", async (req, res) => {
  //TODO: validation
  //Call logic
  try {
    const LoginInfo = await AuthCtrl.login(
      req.body.username,
      req.body.password
    );
    res.json(LoginInfo);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/register", async (req, res) => {
  //validation
  if (!req.body.password || req.body.password < 6) {
    res.status(400).send("Password must contain at least 6 characters");
    return;
  }
  try {
    const newUser = await AuthCtrl.register(
      req.body.username,
      req.body.email,
      req.body.password
    );
    res.json(newUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
