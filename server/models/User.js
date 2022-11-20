const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
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
  readNotif: {
    type: Array,
    default: [],
    required: false,
  },
  unreadNotif: {
    type: Array,
    default: [],
    required: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
