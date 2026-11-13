const express = require("express");
const router = express.Router();

// Add dashboard API/data routes here.
router.get("/", (req, res) => res.redirect("/"));

module.exports = router;
