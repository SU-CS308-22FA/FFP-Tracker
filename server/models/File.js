const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  submitDate: {
    type: Date,
    required: true,
  },
  currentStatus: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("File", FileSchema);
