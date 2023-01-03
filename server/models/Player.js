const { Double } = require("mongodb");
const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",  
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  wage: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
    },
  birthDate: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Player", PlayerSchema);
