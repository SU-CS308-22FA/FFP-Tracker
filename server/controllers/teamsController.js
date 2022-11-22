const User = require("../models/User");
const Team = require("../models/Team");
const Revenue = require("../models/Revenue");
const Expense = require("../models/Expense");
const asyncHandler = require("express-async-handler");

// @desc Get all teams
// @route GET /teams
// @access public
const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find().lean();
  res.json(teams);
});

const getAllGraphData = asyncHandler(async (req, res) => {
  const teams = await Team.find().lean();
  const rev = await Revenue.find().lean();
  const exp = await Expense.find().lean();
  const data = {
    teams,
    revenues: rev,
    expenses: exp,
  };
  res.status(200).json(data);
});

// @desc Get a team by name
// @route GET /teams/:name
// @access public
const getTeamById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const team = await Team.findOne({ _id: id }).lean();
  if (!team) return res.status(400).json({ error: "No team was found!" });
  res.status(200).json(team);
});

// @desc Get team graph data by id
// @route GET /teams/graph/:id
// @access public
const getTeamGraphDataById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const team = await Team.findOne({ _id: id }).lean();
  if (!team) return res.status(400).json({ error: "No team was found!" });
  const revenues = await Revenue.findOne({ teamId: id }).lean();
  const expenses = await Expense.findOne({ teamId: id }).lean();
  const data = {
    team,
    revenues,
    expenses,
  };
  res.status(200).json(data);
});

// @desc Get team admin by team name
// @route GET /teams/:name/admin
// @access private
const getTeamAdmin = asyncHandler(async (req, res) => {
  const name = req.params.name;
  const team = await Team.findOne({ teamName: name }).lean();
  if (!team) return res.status(400).json({ error: "No team was found!" });
  const admin = await User.findOne({ _id: team.admin }).lean();
  res.status(200).json(admin);
});

// @desc Create new team
// @route POST /teams
// @access private
const createTeam = asyncHandler(async (req, res) => {
  const { teamName, seasonBudget } = req.body;
  if (!teamName || !seasonBudget) {
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
    seasonBudget,
    currentBudget: seasonBudget,
  };
  const team = await Team.create(teamObject);
  if (team) {
    const exp = await Expense.create({
      teamId: team._id,
      salaries: {},
      amortization: {},
      operational: {},
    });
    const rev = await Revenue.create({
      teamId: team._id,
      ticketing: {},
      marketing: {},
      broadcasting: {},
    });
    return res.status(201).json({ message: "Team created successfully!" });
  } else {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

module.exports = {
  getAllTeams,
  getAllGraphData,
  getTeamGraphDataById,
  getTeamById,
  createTeam,
  getTeamAdmin,
  getTeamGraphDataById,
};
