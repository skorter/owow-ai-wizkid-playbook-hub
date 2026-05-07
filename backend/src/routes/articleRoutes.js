const express = require("express");
const { articleReady } = require("../controllers/articleController");

const router = express.Router();

// Placeholder (Phase 2): confirms module wiring works
router.get("/", articleReady);

module.exports = router;

