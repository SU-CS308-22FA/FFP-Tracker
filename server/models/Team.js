const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    required: false,
    default: "",
  },
  wikiLink: {
    type: String,
    required: false,
    default: null,
  },
  seasonBudget: {
    type: Number,
    required: true,
  },
  currentBudget: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Team", TeamSchema);
