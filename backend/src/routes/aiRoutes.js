const express = require("express");
const {
  getAIStatus,
  aiSearch,
  aiReady,
} = require("../controllers/aiController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/status", getAIStatus);
router.get("/", aiReady);
router.post("/search", authMiddleware, aiSearch);

module.exports = router;
