const jwt = require("jsonwebtoken");
const { findById } = require("../database/user");

const authMdw = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).send("Missing JWT token");
  }
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, "MY_PRIVATE_KEY", async (err, decodedInfo) => {
    if (err) {
      res.status(401).send("Invalid token");
    } else {
      const user = await findById(decodedInfo.userId);
      req.user = user;
      next();
    }
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).send("Permission denied");
  } else {
    next();
  }
};

module.exports = { authMdw, requireAdmin };
