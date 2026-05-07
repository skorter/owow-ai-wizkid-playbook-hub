const express = require("express");
const { aiReady } = require("../controllers/aiController");

const router = express.Router();

// Placeholder (Phase 2): confirms module wiring works
router.get("/", aiReady);

module.exports = router;

