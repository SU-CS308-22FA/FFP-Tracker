const mongoose = require("mongoose");

const NewUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("NewUser", NewUserSchema);
