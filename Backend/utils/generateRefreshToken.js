const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const createRefreshToken = async (details) => {
  const token = await jwt.sign(details, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  const updateUser = await UserModel.updateOne(
    { _id: details.userId },
    { refresh_token: token }
  );
  return token;
};

module.exports = { createRefreshToken };
