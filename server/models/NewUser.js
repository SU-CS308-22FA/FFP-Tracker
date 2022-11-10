const mongoose = require("mongoose");

const NewUserSchema = new mongoose.Schema({
  fullname: {
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
});

module.exports = mongoose.model("NewUser", NewUserSchema);
