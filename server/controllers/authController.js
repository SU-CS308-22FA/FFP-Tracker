const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

/**
 * Login to the system
 * @async
 * @function
 * @param {string} email - Email of the user
 * @param {string} password - Password of the user
 * @returns {object} accessToken - JWT token
 * @throws 400 Bad Request - All fields are required
 * @throws 404 User not found - Wrong Credentials
 * @throws 401 Unauhtorized - Wrong Credentials
 */
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
  const accessToken = jwt.sign(
    { id: foundUser._id, role: foundUser.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
  res.status(200).json({ accessToken });
});

// @desc Login
// @route POST /auth/logout
// @access Private
const logOut = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "Logged out", isLoggedIn: false });
});

module.exports = { login, logOut };
