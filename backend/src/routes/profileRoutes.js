const express = require("express");
const { getActivity, getInsights } = require("../controllers/profileController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/activity", authMiddleware, getActivity);
router.get("/insights", authMiddleware, getInsights);

module.exports = router;
