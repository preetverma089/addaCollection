const express = require("express");
const router = express.Router();
const cors = require("cors");
const userController = require("../controllers/user.controller");
router.post("/register", cors(), userController.registerUser);
router.post("/verifyEmail", cors(), userController.verifyEmail);
router.post("/login", cors(), userController.loginUser);
router.post("/logout", cors(), userController.logoutUser);
router.get("/healthCheck", async (req, res) => {
  res.status(200).json({ message: "user api connected" });
});
module.exports = router;
