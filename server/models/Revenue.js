const mongoose = require("mongoose");

const RevenueSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  ticketing: {
    type: Map,
    of: Number,
    required: true,
  },
  marketing: {
    type: Map,
    of: Number,
    required: true,
  },
  broadcasting: {
    type: Map,
    of: Number,
    required: true,
  },
});

module.exports = mongoose.model("Revenue", RevenueSchema);
