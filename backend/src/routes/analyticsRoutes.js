const express = require("express");
const {
  getOverview,
  getSearches,
  getPopularQuestions,
  getFeedbackAnalytics,
  getMissingInfoAnalytics,
} = require("../controllers/analyticsController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();

const adminOnly = ["HR_ADMIN"];

router.use(authMiddleware);
router.use(roleMiddleware(adminOnly));

router.get("/overview", getOverview);
router.get("/searches", getSearches);
router.get("/popular-questions", getPopularQuestions);
router.get("/feedback", getFeedbackAnalytics);
router.get("/missing-info", getMissingInfoAnalytics);

module.exports = router;
