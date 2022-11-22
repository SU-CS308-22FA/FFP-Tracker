const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(404).json({ message: "User Not Found!" });
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });
  return res
    .status(200)
    .json({ message: "Logged in", id: foundUser._id, isLoggedIn: true });
});

// @desc Login
// @route POST /auth/logout
// @access Private
const logOut = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "Logged out", isLoggedIn: false });
});

module.exports = { login, logOut };
