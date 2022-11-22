const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController");

router
  .route("/")
  .get(teamsController.getAllTeams)
  .post(teamsController.createTeam);

router.route("/data").get(teamsController.getAllGraphData);

router.route("/data/:id").get(teamsController.getTeamGraphDataById);

router.route("/:id").get(teamsController.getTeamById);
router.route("/:name/admin").get(teamsController.getTeamAdmin);

module.exports = router;
