const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  transactionId: String,
  riskScore: Number,
  riskLevel: String,
  reasons: [String],
  status: { type: String, enum: ["OPEN", "UNDER_REVIEW", "CLOSED"], default: "OPEN" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
