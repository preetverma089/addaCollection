const express = require("express");
const router = express.Router();
const cors = require("cors");
const userController = require("../controllers/user.controller");
const authorization = require("../middleware/auth");
const upload = require("../middleware/multer");
router.post("/register", cors(), userController.registerUser);
router.post("/verifyEmail", cors(), userController.verifyEmail);
router.post("/login", cors(), userController.loginUser);
router.get("/logout", cors(), authorization.auth, userController.logoutUser);
router.put(
  "/upload-avatar",
  cors(),
  authorization.auth,
  upload.single("avatar"), // this name is similar for sending data or file from client side
  userController.uploadUserAvatar
);
router.get("/healthCheck", async (req, res) => {
  res.status(200).json({ message: "user api connected" });
});
module.exports = router;
