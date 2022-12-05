const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

router.route("/").get(fileController.getAllFiles);

router.route("/team/:id").get(fileController.getFilesByTeamId);

router.route("/:id").get(fileController.getFileById);

module.exports = router;
