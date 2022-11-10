const NewUser = require("../models/NewUser");
const asyncHandler = require("express-async-handler"); // Lessen the try catch blocks
const bcrypt = require("bcrypt");

// @desc Create new user
// @route POST /users
// @access private
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, key, role } = req.body;
  // Confirm data
  if (!fullname || !key || !role) {
    return res
      .status(400)
      .json({ error: "All fields are required to register a new user!" });
  }
  // Check for duplicates in the database
  const result = await NewUser.create({ fullname, key, role });
  return res.status(201).json({ message: "User registered successfully!" });
});

module.exports = {
  registerUser,
};
