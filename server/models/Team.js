const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
    default: null,
  },
  wikiLink: {
    type: String,
    required: false,
    default: "",
  },
  manager: {
    type: String,
    required: false,
    default: null,
  },
  logoURL: {
    type: String,
    required: false,
    default: "",
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
