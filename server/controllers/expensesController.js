const Expense = require("../models/Expense");
const Team = require("../models/Team");
const asyncHandler = require("express-async-handler");

// @desc Get all expenses
// @route GET /expenses
// @access public
const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().lean();
  res.json(expenses);
});

// @desc Get a revenues of team by id
// @route GET /revenues/:id
// @access private
const getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rev = await Expense.findOne({ teamId: id }).select("-__v");
  if (!rev)
    return res.status(404).json({ error: "No expenses found for this team!" });
  return res.status(200).json(rev);
});

// @desc Create a new revenue for a team
// @route POST /revenues/:id
// @access private
const createExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findOne({ _id: id });
  if (!team) return res.status(404).json({ error: "Team not found!" });
  const exp = await Expense.create({
    teamId: id,
    salaries: {},
    amortization: {},
    operational: {},
  });
  return res.status(201).json(exp);
});

// @desc Update a revenues of team by id
// @route PATCH /revenues/:id
// @access private
const updateExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { month, salaries, amortization, operational } = req.body;
  if (!salaries || !amortization || !operational || !month) {
    return res
      .status(400)
      .json({ error: "All fields are required to update a team's revenues!" });
  }
  const exp = await Expense.findOne({ teamId: id });
  if (!exp)
    return res.status(404).json({ error: "No revenue found for this team!" });
  exp.salaries.set(month, salaries);
  exp.amortization.set(month, amortization);
  exp.operational.set(month, operational);
  const result = await exp.save();
  return res.status(200).json(exp);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const revs = await Expense.findOne({ teamId: id });
  if (!revs)
    return res.status(404).json({ error: "No expense found for this team!" });

  let lastDate = "";
  const { month, salaries, amortization, operational } = revs;

  for (const [key, value] of salaries) {
    if (String(key) > lastDate) {
      lastDate = String(key);
    }
  }

  let newSalaries = {};
  for (const [key, value] of salaries) {
    if (String(key) != lastDate) {
      newSalaries[key] = value;
    }
  }

  let newAmortization = {};
  for (const [key, value] of amortization) {
    if (String(key) != lastDate) {
      newAmortization[key] = value;
    }
  }

  let newOperational = {};
  for (const [key, value] of operational) {
    if (String(key) != lastDate) {
      newOperational[key] = value;
    }
  }

  revs.salaries = newSalaries;
  revs.amortization = newAmortization;
  revs.operational = newOperational;

  const result = await revs.save();
  return res.status(200).json(revs);
});

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpenseById,
  updateExpenseById,
  deleteExpense,
};
