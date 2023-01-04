//thu vien dung de ma hoa
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { findByUsername, insertUser } = require("../database/user");

const login = async (username, password) => {
  //Step 1: find user by username
  const existedUser = await findByUsername(username);
  if (!existedUser) {
    throw new Error("Username is not existed");
  }

  //Step 2: verify password
  if (!verifyPassword(password, existedUser)) {
    throw new Error("Password not correct");
  }

  //Step 3: generate toke (jwt) //npm install jsonwebtoken
  const token = jwt.sign({ userId: existedUser._id }, "MY_PRIVATE_KEY", {
    expiresIn: 60 * 60,
  });
  return { user: existedUser, token: token };
};

const register = async (username, email, password) => {
  //Step 1: check username is existed
  const existedUser = await findByUsername(username);
  if (existedUser) {
    throw new Error("Username is existed");
  }

  //Step 2: Encrypt the password
  const { salt, hashedPassword } = encryptPassword(password);

  //Step 3 : Store inside database
  const insertedUser = await insertUser({
    username: username,
    email: email,
    salt: salt,
    hashedPassword: hashedPassword,
  });

  return insertedUser;
};

const encryptPassword = (password) => {
  //Private key for single user
  const salt = crypto.randomBytes(128).toString("hex");

  //Hashed password
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hashedPassword: hashedPassword,
  };
};

const verifyPassword = (password, user) => {
  const hashedPassword = crypto
    .pbkdf2Sync(password, user.salt, 10000, 64, "sha512")
    .toString("hex");

  return hashedPassword == user.hashedPassword;
};

module.exports = { login, register };
