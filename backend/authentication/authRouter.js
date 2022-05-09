const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;
const authController = require("./middleware/authenticationController");
const auth = require("./middleware/auth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome to FreeCodeCamp 🙌");
});

module.exports = router;
