const mongoose = require("mongoose");

const connectDB = () => {
  try {
    console.log("Connecting to MongoDB...");
    mongoose.connect(process.env.DB_URI);
  } catch (err) {
    console.log("Error occurred while connecting to MongoDB:\n", err);
  }
};

module.exports = connectDB;
