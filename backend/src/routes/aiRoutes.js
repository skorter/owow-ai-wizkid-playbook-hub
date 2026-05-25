const express = require("express");
const {
  getAIStatus,
  aiSearch,
  aiAskPage,
  aiRecentSearches,
  aiReady,
} = require("../controllers/aiController");
const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/status", getAIStatus);
router.get("/", aiReady);
router.post("/search", optionalAuthMiddleware, aiSearch);
router.post("/ask-page", optionalAuthMiddleware, aiAskPage);
router.get("/recent-searches", authMiddleware, aiRecentSearches);

module.exports = router;
