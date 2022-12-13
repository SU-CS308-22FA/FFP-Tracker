const User = require("../models/User");
const NewUser = require("../models/NewUser");
const Team = require("../models/Team");
const asyncHandler = require("express-async-handler"); // Lessen the try catch blocks
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access private --> to be handled later
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -__v").lean();
  if (!users?.length)
    return res.status(400).json({ error: "No users were found!" });
  res.json(users);
});

const getSingleUser = asyncHandler(async (req, res) => {
  const id = req.user;
  const role = req.role;
  if (!id) return res.status(403).json({ error: "Forbidden" });
  const user = await User.findOne({ _id: id }).select("-password -__v").lean();
  if (!user) return res.status(404).json({ error: "User not found!" });
  res.json(user);
});

// @desc Get a user by id
// @route GET /users/:id
// @access private --> to be handled later
const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id }).select("-password -__v").lean();
  if (!user) return res.status(400).json({ error: "No user was found!" });
  res.json(user);
});

// @desc Create new user
// @route POST /users
// @access private
const createUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, key } = req.body;
  // Confirm data
  if (!username || !email || !password || !key || !fullname) {
    return res
      .status(400)
      .json({ error: "All fields are required to create a new user!" });
  }
  // Check for duplicates in the database
  const userInfo = await NewUser.findOne({ key }).lean().exec();
  const duplicate_username = await User.findOne({ username }).lean().exec();
  const duplicate_email = await User.findOne({ email }).lean().exec();
  if (!userInfo) {
    return res.status(400).json({ error: "Invalid key!" });
  } else if (userInfo.email !== email) {
    return res
      .status(403)
      .json({ error: "You cannot register with this key!" });
  }
  if (duplicate_username)
    return res.status(409).json({ error: "This username is already in use!" });
  if (duplicate_email)
    return res.status(409).json({ error: "This email is already in use!" });
  // Hash the password
  const hashedPw = await bcrypt.hash(password, 10); // 10 Salt-rounds
  // Create and store the new user
  let userObject;
  if (userInfo.role === "Team Admin") {
    userObject = {
      fullname,
      username,
      email,
      password: hashedPw,
      role: userInfo.role,
      team: userInfo.team,
    };
    const team = await Team.findOne({ _id: userInfo.team }).exec();
    team.admin = user.email;
    await team.save();
  } else {
    userObject = {
      fullname,
      username,
      email,
      password: hashedPw,
      role: userInfo.role,
    };
  }
  const user = await User.create(userObject);
  if (user) {
    NewUser.deleteOne({ key }).exec();
    if (user.role === "Team Admin") {
      const team = await Team.findOne({ _id: user.team }).exec();
      team.teamAdmin = user._id;
      await team.save();
    }
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({
      error: "Invalid user data recevied! There was issue with the server",
    });
  }
});

// @desc Update a user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { fullname, username, password } = req.body;
  // Confirm data
  if (!id || !username) {
    return res.status(400).json({ error: "All of the fields are required!" });
  }
  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ error: "User not found!" });
  // Check for duplicates in the DB
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates only to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(400).json({ error: "Username is already in use!" });
  }
  user.username = username;
  user.fullname = fullname;
  // If the request also has a password, update that as well
  if (password) {
    // Hash the password
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  console.log(updatedUser);
  if (updatedUser) {
    return res.status(200).json({ message: "User updated successfully!" });
  } else {
    return res
      .status(400)
      .json({ error: "There was an issue with the server!" });
  }
});

// @desc Delete a user
// @route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "User ID is required!" });
  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ error: "User does not exist!" });
  const result = await user.deleteOne();
  const reply = `${result.username} succesfully deleted.`;
  res.json(reply);
});

module.exports = {
  getAllUsers,
  getUserById,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
