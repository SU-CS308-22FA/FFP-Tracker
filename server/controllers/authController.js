const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const foundUser = await User.findOne({ email })
    .select("-password, -__v")
    .lean();
  if (!foundUser) {
    return res.status(404).json({ error: "Wrong Credentials!" });
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ error: "Wrong Credentials!" });
  return res
    .status(200)
    .json({ message: "Logged in", user: foundUser, isLoggedIn: true });
});

// @desc Login
// @route POST /auth/logout
// @access Private
const logOut = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "Logged out", isLoggedIn: false });
});

module.exports = { login, logOut };
