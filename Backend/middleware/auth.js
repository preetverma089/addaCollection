const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req?.header?.authorization?.split(" ")[1]; // Bearer token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Provide Token", error: true, success: false });
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode)
      return res
        .status(401)
        .json({ message: "Token not valid", error: true, success: false });

    req.userId = decode.userId;
    console.log("decoded");
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

module.exports = { auth };
