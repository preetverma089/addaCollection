import UserModel from "../models/user.model";
const bcrypt = require("bcrypt");
import sendEmail from "../config/sendEmail";
import verifyEmailTemplate from "../utils/verifyEmailTemplate";
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(401).json({
        message: "provide email, name, password",
        error: true,
        success: false,
      });
    const isUserExists = await UserModel.findOne({ email });
    if (isUserExists)
      return res.status(409).json({
        message: "User already exists !!, please try with another email",
        success: false,
      });
    const salt = bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userDetails = {
      name,
      email,
      hashedPassword,
    };
    const isUserCreated = await UserModel.create(userDetails);
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${isUserCreated._id}`;
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify for email register",
      html: verifyEmailTemplate(name, verifyEmailUrl),
    });
    if (isUserCreated)
      return res.status(200).json({
        message: "user created succesfull",
        error: false,
        success: true,
        data: isUserCreated,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = { registerUser };
