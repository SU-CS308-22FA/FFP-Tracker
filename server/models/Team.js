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
    default: "",
  },
  manager: {
    type: String,
    required: false,
    default: "",
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
  lawyers: {
    type: Array,
    required: true,
    default: [],
  },
  boardMembers: {
    type: Array,
    required: true,
    default: [],
  },
  sponsorBudget: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("Team", TeamSchema);
