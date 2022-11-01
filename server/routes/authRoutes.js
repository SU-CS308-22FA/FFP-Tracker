const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/").post(authController.login);

router.route("/logout").post(authController.logOut);

module.exports = router;
