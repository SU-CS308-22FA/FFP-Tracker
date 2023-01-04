const Revenue = require("../models/Revenue");
const Team = require("../models/Team");
const asyncHandler = require("express-async-handler");

// @desc Get all revenues
// @route GET /revenues
// @access public
const getAllRevenues = asyncHandler(async (req, res) => {
  const revenues = await Revenue.find().lean();
  res.json(revenues);
});

// @desc Get a revenues of team by id
// @route GET /revenues/:id
// @access private
const getRevenueById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rev = await Revenue.findOne({ teamId: id }).select("-__v");
  if (!rev)
    return res.status(404).json({ error: "No revenue found for this team!" });
  return res.status(200).json(rev);
});

// @desc Create a new revenue for a team
// @route POST /revenues/:id
// @access private
const createRevenueById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findOne({ _id: id });
  if (!team) return res.status(404).json({ error: "Team not found!" });
  const dup = await Revenue.findOne({ teamId: id });
  if (dup) return res.status(400).json({ error: "Revenue already exists!" });
  const rev = await Revenue.create({
    teamId: id,
    ticketing: {},
    marketing: {},
    broadcasting: {},
  });
  return res.status(201).json(rev);
});

// @desc Update a revenues of team by id
// @route PATCH /revenues/:id
// @access private
const updateRevenueById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { ticketing, marketing, broadcasting, month } = req.body;
  if (!ticketing || !marketing || !broadcasting || !month) {
    return res
      .status(400)
      .json({ error: "All fields are required to update a team's revenues!" });
  }
  const rev = await Revenue.findOne({ teamId: id });
  const team = await Team.findOne({ _id: id });
  if (!team) return res.status(404).json({ error: "Team not found!" });
  if (!rev)
    return res.status(404).json({ error: "No revenue found for this team!" });
  if (rev.ticketing.get(month) !== undefined) {
    return res
      .status(400)
      .json({ error: "Revenue already exists for this month!" });
  }
  rev.ticketing.set(month, ticketing);
  rev.marketing.set(month, marketing);
  rev.broadcasting.set(month, broadcasting);
  team.currentBudget =
    Number(team.currentBudget) +
    Number(ticketing) +
    Number(marketing) +
    Number(broadcasting);
  console.log(team.currentBudget);
  await team.save();
  await rev.save();
  return res.status(201).json(rev);
});

const deleteRevenue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const revs = await Revenue.findOne({ teamId: id });
  if (!revs)
    return res.status(404).json({ error: "No revenue found for this team!" });
  let lastDate = "";
  const { ticketing, marketing, broadcasting, month } = revs;
  for (const [key, value] of ticketing) {
    if (String(key) > lastDate) {
      lastDate = String(key);
    }
  }
  let newTicketing = {};
  for (const [key, value] of ticketing) {
    if (String(key) != lastDate) {
      newTicketing[key] = value;
    }
  }
  let newMarketing = {};
  for (const [key, value] of marketing) {
    if (String(key) != lastDate) {
      newMarketing[key] = value;
    }
  }
  let newBroadcasting = {};
  for (const [key, value] of broadcasting) {
    if (String(key) != lastDate) {
      newBroadcasting[key] = value;
    }
  }
  revs.ticketing = newTicketing;
  revs.marketing = newMarketing;
  revs.broadcasting = newBroadcasting;

  const result = await revs.save();
  return res.status(200).json(revs);
});

module.exports = {
  getAllRevenues,
  getRevenueById,
  createRevenueById,
  updateRevenueById,
  deleteRevenue,
};
