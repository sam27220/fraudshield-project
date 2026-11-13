
require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const Transaction = require("./models/Transaction");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// FORMAT TRANSACTION
function formatTransaction(t) {
  return {
    id: t.transactionId,
    from: t.from || "Unknown",
    to: t.to || "Unknown",
    amount: t.amount || 0,
    time: t.createdAt
      ? t.createdAt.toLocaleString("en-IN")
      : "-",
    status: t.status || "Pending",
    score: t.riskScore || 0,
    riskLevel: t.riskLevel || "LOW",
    reasons: t.reasons || []
  };
}

// DASHBOARD
app.get("/", async (req, res) => {
  try {
    const records = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const total = await Transaction.countDocuments();

    const flagged = await Transaction.countDocuments({
      riskScore: { $gte: 70 }
    });

    const result = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: "$riskScore" }
        }
      }
    ]);

    const avgRisk = result.length
      ? Math.round(result[0].average)
      : 0;

    res.render("dashboard", {
      transactions: records.map(formatTransaction),
      total,
      flagged,
      avgRisk
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).send("Dashboard loading failed");
  }
});

// ALL TRANSACTIONS
app.get("/transactions", async (req, res) => {
  try {
    const records = await Transaction.find()
      .sort({ createdAt: -1 });

    res.render("transactions", {
      transactions: records.map(formatTransaction)
    });

  } catch (error) {
    console.error("Transactions Error:", error);
    res.status(500).send("Transactions loading failed");
  }
});

// FRAUD ALERTS
app.get("/alerts", async (req, res) => {
  try {
    const records = await Transaction.find({
      riskScore: { $gte: 40 }
    }).sort({ createdAt: -1 });

    res.render("alerts", {
      alerts: records.map(formatTransaction)
    });

  } catch (error) {
    console.error("Alerts Error:", error);
    res.status(500).send("Alerts loading failed");
  }
});

// AML NETWORK
app.get("/network", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 });

    res.render("network", {
      transactions
    });

  } catch (error) {
    console.error("Network Error:", error);
    res.status(500).send("Network page error: " + error.message);
  }
});

// ANALYZE PAGE
app.get("/analyze", (req, res) => {
  res.render("analyze");
});

// ANALYZE TRANSACTION
app.post("/analyze", async (req, res) => {
  try {
    const from = String(req.body.from || "")
      .trim().toUpperCase();

    const to = String(req.body.to || "")
      .trim().toUpperCase();

    const amount = Number(req.body.amount);
    const hour = Number(req.body.hour);

    const newBeneficiary =
      req.body.newBeneficiary === "true";

    const rapid = req.body.rapid === "true";
    const circular = req.body.circular === "true";

    if (
      !from ||
      !to ||
      from === to ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isInteger(hour) ||
      hour < 0 ||
      hour > 23
    ) {
      return res.status(400).send(
        "Invalid transaction details. Please check the form."
      );
    }

    // RISK CALCULATION
    let score = 0;
    const reasons = [];

    if (amount >= 20000) {
      score += 25;
      reasons.push("Large transaction amount");
    }

    if (hour < 4) {
      score += 10;
      reasons.push("Unusual transaction hour");
    }

    if (newBeneficiary) {
      score += 15;
      reasons.push("New beneficiary detected");
    }

    if (rapid) {
      score += 20;
      reasons.push("Rapid transactions detected");
    }

    if (circular) {
      score += 25;
      reasons.push("Possible circular transaction pattern");
    }

    score = Math.min(score, 100);

    let level = "LOW";

    if (score >= 70) {
      level = "HIGH";
    } else if (score >= 40) {
      level = "MEDIUM";
    }

    let status = "Clear";

    if (level === "HIGH") {
      status = "Flagged";
    } else if (level === "MEDIUM") {
      status = "Review";
    }

    const transaction = await Transaction.create({
      transactionId: "TXN" + Date.now(),
      from,
      to,
      amount,
      hour,
      newBeneficiary,
      rapid,
      circular,
      riskScore: score,
      riskLevel: level,
      reasons,
      status
    });

    res.render("result", {
      transaction: formatTransaction(transaction)
    });

  } catch (error) {
    console.error("Analyze Error:", error);
    res.status(500).send("Transaction analysis failed");
  }
});

// SERVER + DATABASE CONNECTION
if (!process.env.MONGODB_URI) {
  console.error("ERROR: MONGODB_URI not found in .env file");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error.message);
  });
