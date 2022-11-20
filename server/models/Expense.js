const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  salaries: {
    type: Map,
    of: Number,
    required: true,
  },
  amortization: {
    type: Map,
    of: Number,
    required: true,
  },
  operational: {
    type: Map,
    of: Number,
    required: true,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
