const Expense = require("../models/Expense");
const Team = require("../models/Team");
const File = require("../models/File");
const asyncHandler = require("express-async-handler");

// @desc Get all files
// @route GET /files
// @access private
const getAllFiles = asyncHandler(async (req, res) => {
  const files = await File.find().lean();
  res.json(files);
});

// @desc Get a file by id
// @route GET /files/:id
// @access private
const getFileById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const file = await File.findOne({ _id: id }).lean();
  if (!file) return res.status(404).json({ error: "File not found!" });
  return res.status(200).json(file);
});

// @desc Get a file by team id
// @route GET /files/team/:id
// @access private
const getFilesByTeamId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findOne({ _id: id }).lean();
  if (!team) return res.status(404).json({ error: "Team not found!" });

  const files = await File.find({ teamName: team.teamName }).lean();
  if (!files) return res.status(404).json({ error: "No file found" });
  return res.status(200).json(files);
});

/**
 * @desc Create a new file submission in the database
 * @route POST /files/:id
 * @access private
 * @param {string} id - Team ID in the database
 * @param {string} file - File url of the submitted file
 * @param {string} submitDate - Date of submission
 * @throws {400} - Bad Request - Missing required fields
 * @throws {404} - Not Found - Team not found
 * @throws {500} - Server Error - Error creating file
 * @returns {object} newFile - New file object
 */
const createSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { file, submitDate } = req.body;
  if (!file || !submitDate)
    return res.status(400).json({ error: "Missing required fields" });
  const team = await Team.findOne({ _id: id }).lean();
  if (!team) return res.status(404).json({ error: "Team not found!" });
  const newFile = await File.create({
    name: `${team.teamName} - ${submitDate}`,
    url: file,
    teamName: team.teamName,
    submitDate,
    teamId: id,
    currentStatus: "Submitted",
    lastUpdated: submitDate,
  });
  if (!newFile) return res.status(500).json({ error: "Error creating file" });
  return res.status(200).json(newFile);
});

// @desc Update a file
// @route PATCH /files/:id
// @access private
const updateFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { process, lastUpdated } = req.body;
  if (!process || !lastUpdated)
    return res.status(400).json({ error: "Missing required fields" });
  const file = await File.findOne({
    _id: id,
  }).lean();
  if (!file) return res.status(404).json({ error: "File not found!" });
  const updatedFile = await File.findOneAndUpdate(
    { _id: id },
    { currentStatus: process, lastUpdated },
    { new: true }
  );
  if (!updatedFile)
    return res.status(400).json({ error: "Error updating file" });
  return res.status(200).json(updatedFile);
});

module.exports = {
  getAllFiles,
  getFileById,
  getFilesByTeamId,
  createSubmission,
  updateFile,
};
