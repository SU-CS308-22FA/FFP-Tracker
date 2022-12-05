const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(teamsController.getAllTeams)
  .post(verifyJWT, teamsController.createTeam);

router.route("/data").get(teamsController.getAllGraphData);

router.route("/data/:id").get(teamsController.getTeamGraphDataById);

router
  .route("/:id")
  .get(teamsController.getTeamById)
  .patch(verifyJWT, teamsController.updateTeam);

router.route("/:name/admin").get(teamsController.getTeamAdmin);

module.exports = router;
