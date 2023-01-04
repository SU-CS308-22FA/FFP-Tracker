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
    lawyers: [],
    boardMembers: [],
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

// @desc Update team
// @route PATCH /teams/:id
// @access private
const updateTeam = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { wikiLink, manager, logoURL, lawyers, boardMembers, sponsorBudget } =
    req.body;
  if (sponsorBudget || sponsorBudget === 0) {
    const team = await Team.findOne({ _id: id }).lean();
    if (!team) return res.status(400).json({ error: "No team was found!" });
    const updatedTeam = await Team.findOneAndUpdate(
      { _id: id },
      { sponsorBudget }
    );
    if (updatedTeam) {
      return res.status(200).json({ message: "Team updated successfully!" });
    } else {
      res.status(500).json({ error: "Something went wrong!" });
    }
  } else {
    if (
      wikiLink === undefined ||
      manager === undefined ||
      logoURL === undefined ||
      !lawyers ||
      !boardMembers
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required to update a team!" });
    }
    const team = await Team.findOne({ _id: id }).lean();
    if (!team) return res.status(400).json({ error: "No team was found!" });
    const updatedTeam = await Team.findOneAndUpdate(
      { _id: id },
      { wikiLink, manager, logoURL, lawyers, boardMembers },
      { new: true }
    );
    if (updatedTeam) {
      return res.status(200).json({ message: "Team updated successfully!" });
    } else {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
});

const updateTeamBudget = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { currentBudget } = req.body;
  if (!currentBudget) {
    return res
      .status(400)
      .json({ error: "All fields are required to update a team!" });
  }
  const team = await Team.findOne({
    _id: id,
  }).lean();
  if (!team) return res.status(400).json({ error: "No team was found!" });
  const updatedTeam = await Team.findOneAndUpdate(
    { _id: id },
    { currentBudget },
    { new: true }
  );
  if (updatedTeam) {
    return res.status(200).json({ message: "Team updated successfully!" });
  } else {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

const deleteTeam = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Team ID is required!" });
  const user = await Team.findOne({ _id: id }).exec();
  if (!user) return res.status(400).json({ error: "Team does not exist!" });
  const result = await Team.deleteOne({ _id: id });
  const reply = `${result.teamName} succesfully deleted.`;
  res.json(reply);
});

module.exports = {
  getAllTeams,
  getAllGraphData,
  getTeamGraphDataById,
  getTeamById,
  createTeam,
  updateTeam,
  getTeamAdmin,
  getTeamGraphDataById,
  deleteTeam,
  updateTeamBudget,
};
