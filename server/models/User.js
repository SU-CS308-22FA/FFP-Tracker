const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Team",
    default: null,
  },
  notifications: {
    type: Array,
    default: [],
    required: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
