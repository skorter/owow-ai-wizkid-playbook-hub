const express = require("express");
const {
  getOverview,
  getSearches,
  getPopularQuestions,
  getFeedbackAnalytics,
  getMissingInfoAnalytics,
  getUsageTrends,
  getPeakHours,
  getUnansweredQuestions,
  getPerformance,
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
router.get("/usage-trends", getUsageTrends);
router.get("/peak-hours", getPeakHours);
router.get("/unanswered-questions", getUnansweredQuestions);
router.get("/performance", getPerformance);

module.exports = router;
