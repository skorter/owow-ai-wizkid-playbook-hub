const express = require("express");
const { analyticsReady } = require("../controllers/analyticsController");

const router = express.Router();

// Placeholder (Phase 2): confirms module wiring works
router.get("/", analyticsReady);

module.exports = router;

