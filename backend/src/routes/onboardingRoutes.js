const express = require("express");
const { onboardingReady } = require("../controllers/onboardingController");

const router = express.Router();

// Placeholder (Phase 2): confirms module wiring works
router.get("/", onboardingReady);

module.exports = router;

