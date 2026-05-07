const express = require("express");
const { categoryReady } = require("../controllers/categoryController");

const router = express.Router();

// Placeholder (Phase 2): confirms module wiring works
router.get("/", categoryReady);

module.exports = router;

