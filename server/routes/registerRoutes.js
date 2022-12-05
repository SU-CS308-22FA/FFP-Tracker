const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").post(verifyJWT, registerController.registerUser);

module.exports = router;
