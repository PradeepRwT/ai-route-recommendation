const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  source: String,
  destination: String,
  distance: Number,   // km
  time: Number,       // minutes
  traffic: Number,    // 1 (low) - 10 (high)
  score: Number,      // AI score
}, { timestamps: true });

module.exports = mongoose.model("Route", routeSchema);