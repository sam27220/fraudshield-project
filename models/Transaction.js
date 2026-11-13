const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
    },
    from: { type: String, default: "Unknown" },
    to: { type: String, default: "Unknown" },
    amount: Number,
    hour: Number,
    newBeneficiary: Boolean,
    rapid: Boolean,
    circular: Boolean,
    riskScore: Number,
    riskLevel: String,
    from: { type: String, required: true },
    to: { type: String, required: true },
    reasons: [String],
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
