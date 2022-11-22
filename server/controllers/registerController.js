const NewUser = require("../models/NewUser");
const User = require("../models/User");
const Team = require("../models/Team");
const asyncHandler = require("express-async-handler"); // Lessen the try catch blocks
const bcrypt = require("bcrypt");

// @desc Create new user
// @route POST /users
// @access private
const registerUser = asyncHandler(async (req, res) => {
  const { email, key, role, team } = req.body;
  // Confirm data
  if (!email || !key || !role) {
    return res
      .status(400)
      .json({ error: "All fields are required to register a new user!" });
  }
  if (role === "Team Admin" && !team) {
    return res.status(400).json({
      error: "Role is entered as a Team Admin, but no team name supplied!",
    });
  }
  // Check if user already exists
  const user = await NewUser.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ error: "User already exists in the registration queue!" });
  }
  const alreadyInSystem = await User.findOne({ email });
  if (alreadyInSystem) {
    return res
      .status(400)
      .json({ error: "User already exists in the system!" });
  }
  let newUser;
  if (role === "Team Admin") {
    console.log("here!");
    const teamExists = await Team.findOne({ teamName: team }).lean().exec();
    if (!teamExists) {
      return res.status(400).json({ error: "Team does not exist!" });
    }
    console.log(teamExists._id);
    newUser = {
      email,
      key,
      role,
      team: teamExists._id,
    };
  } else {
    newUser = {
      email,
      key,
      role,
    };
  }
  const result = await NewUser.create(newUser);
  return res.status(201).json({ message: "User registered successfully!" });
});

module.exports = {
  registerUser,
};
