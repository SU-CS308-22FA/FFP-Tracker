require("dotenv").config({
  path: "../.env",
});
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;
const { fileURLToPath } = require("url");

connectDB();

// To enable Cross Origin Resource Sharing
app.use(cors(corsOptions));

// For the app to parse and send JSON data
app.use(express.json());

// Built-in Middleware: Static Files --> .css, .png, .img files
app.use(express.static(path.join(__dirname + "/../client/build")));

// Routes
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/auth", require("./routes/authRoutes"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/build/index.html"));
});

// This catches all requests that fall outside of the routes that are defined
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html"))
    res.sendFile(path.join(__dirname, "public", "html", "404.html"));
  else if (req.accepts("json")) res.json({ message: "404 Not Found!" });
  else res.type("txt").send("404 Not Found!");
});

// Once the DB connection is established, listen to the port
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
