const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const config = require("../config/sendEmail");
const utils = require("../utils/verifyEmailTemplate");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userDetails = {
      name,
      email,
      password: hashedPassword,
    };
    const isUserCreated = await UserModel.create(userDetails);
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${isUserCreated._id}`;
    const temp = utils.verifyEmailTemplate(name, verifyEmailUrl);
    console.log("ggfngn", temp);
    const verifyEmail = await config.sendEmail({
      sendTo: email,
      subject: "Verify for email register",
      html: utils.verifyEmailTemplate(name, verifyEmailUrl),
    });
    console.log("Email response:", verifyEmail);
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

const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code }).lean();
    if (!user) {
      return res.status(401).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      { verify_email: true }
    );
    return res.status(200).json({
      message: "User updated succesfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(401).json({
        message: "All fields are manadatory",
        error: true,
        success: false,
      });

    const isUserExists = await UserModel.findOne({ email: email }).lean();

    if (!isUserExists)
      return res
        .status(401)
        .json({ message: "User not exists", error: true, success: false });

    const validatePassword = await bcrypt.compare(
      password,
      isUserExists.password
    );
    if (!validatePassword)
      return res
        .status(401)
        .json({ message: "Password not matched", error: true, success: false });
    if (isUserExists.status != "Active")
      return res.status(401).json({
        message: "Account disabled and please contact to admin",
        error: true,
        success: false,
      });

    const token = await generateToken.createToken({
      userId: isUserExists._id,
      userEmail: isUserExists.email,
    });
    const refresh_token = await generateRefreshToken.createRefreshToken({
      userId: isUserExists._id,
      userEmail: isUserExists.email,
    });
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", token, cookiesOption);
    res.cookie("refreshToken", refresh_token, cookiesOption);
    return res.status(200).json({
      message: "User loggedIn succesfully",
      error: false,
      success: true,
      data: { ...isUserExists, token: token },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || message, success: false, error: true });
  }
};

const logoutUser = async (req, res) => {
  try {
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);
    return res.status(200).json({
      message: "user logout succesfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || message,
      success: false,
      error: true,
    });
  }
};

module.exports = { registerUser, verifyEmail, loginUser, logoutUser };
