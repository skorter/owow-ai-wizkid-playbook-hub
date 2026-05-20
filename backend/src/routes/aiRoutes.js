const express = require("express");
const {
  getAIStatus,
  aiSearch,
  aiReady,
} = require("../controllers/aiController");
const { optionalAuthMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/status", getAIStatus);
router.get("/", aiReady);
router.post("/search", optionalAuthMiddleware, aiSearch);

module.exports = router;
