const express = require("express");
const {
  getAIStatus,
  aiSearch,
  aiAskPage,
  aiReady,
} = require("../controllers/aiController");
const { optionalAuthMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/status", getAIStatus);
router.get("/", aiReady);
router.post("/search", optionalAuthMiddleware, aiSearch);
router.post("/ask-page", optionalAuthMiddleware, aiAskPage);

module.exports = router;
