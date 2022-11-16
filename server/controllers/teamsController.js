const User = require("../models/User");
const Team = require("../models/Team");
const asyncHandler = require("express-async-handler");

// @desc Get all teams
// @route GET /teams
// @access public
const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find().lean();
  res.json(teams);
});

// @desc Get a team by name
// @route GET /teams/:name
// @access public
const getTeamById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const team = await Team.findOne({ _id: id }).lean();
  if (!team) return res.status(400).json({ error: "No team was found!" });
  res.json(team);
});

// @desc Get team admin by team name
// @route GET /teams/:name/admin
// @access private
const getTeamAdmin = asyncHandler(async (req, res) => {
  const name = req.params.name;
  const team = await Team.findOne({ teamName: name }).lean();
  if (!team) return res.status(400).json({ error: "No team was found!" });
  const admin = await User.findOne({ _id: team.admin }).lean();
  res.json(admin);
});

// @desc Create new team
// @route POST /teams
// @access private
const createTeam = asyncHandler(async (req, res) => {
  const { teamName, admin, seasonBudget } = req.body;
  if (!teamName || !admin || !seasonBudget) {
    return res
      .status(400)
      .json({ error: "All fields are required to create a new team!" });
  }
  const duplicate_team = await Team.findOne({ teamName }).lean().exec();
  if (duplicate_team)
    return res
      .status(409)
      .json({ error: "There is already a team with this name!" });
  const teamObject = {
    teamName,
    admin,
    seasonBudget,
    currentBudget: seasonBudget,
  };
  const team = await Team.create(teamObject);
  res.json(team);
});

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  getTeamAdmin,
};
