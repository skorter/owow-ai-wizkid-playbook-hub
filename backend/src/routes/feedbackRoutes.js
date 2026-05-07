const express = require("express");
const { feedbackReady } = require("../controllers/feedbackController");

const router = express.Router();

// Placeholder (Phase 2): confirms module wiring works
router.get("/", feedbackReady);

module.exports = router;

