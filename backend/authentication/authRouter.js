const express = require("express");
const authController = require("./middleware/authenticationController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/welcome", authController.verifyToken);

router.get("/forgotpassword", authController.forgotPassword);
router.post("/passwordreset", authController.passwordReset);
router.get("/resetpassword/:id/:token", authController.resetPassword);
router.post("/resetpassword", authController.newPassword);

module.exports = router;
