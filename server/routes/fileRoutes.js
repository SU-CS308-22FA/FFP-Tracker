const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

router.route("/").get(fileController.getAllFiles);

router
  .route("/team/:id")
  .get(fileController.getFilesByTeamId)
  .post(fileController.createSubmission);

router
  .route("/:id")
  .get(fileController.getFileById)
  .patch(fileController.updateFile);

module.exports = router;
