const jwt = require("jsonwebtoken");

const createToken = async (details) => {
  const token = await jwt.sign(details, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = { createToken };
