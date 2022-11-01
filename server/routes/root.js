const express = require("express");
const router = express.Router();
const path = require("path");

// Add front page controller here
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
