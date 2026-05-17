const analyticsService = require("../services/analyticsService");

async function getOverview(req, res, next) {
  try {
    const data = await analyticsService.getOverviewAnalytics();
    return res.status(200).json({
      success: true,
      message: "Analytics overview retrieved successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

async function getSearches(req, res, next) {
  try {
    const data = await analyticsService.getSearchAnalytics(req.query);
    return res.status(200).json({
      success: true,
      message: "Search analytics retrieved successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

async function getPopularQuestions(req, res, next) {
  try {
    const data = await analyticsService.getPopularQuestions(req.query);
    return res.status(200).json({
      success: true,
      message: "Popular questions retrieved successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

async function getFeedbackAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getFeedbackAnalytics(req.query);
    return res.status(200).json({
      success: true,
      message: "Feedback analytics retrieved successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

async function getMissingInfoAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getMissingInfoAnalytics(req.query);
    return res.status(200).json({
      success: true,
      message: "Missing info analytics retrieved successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOverview,
  getSearches,
  getPopularQuestions,
  getFeedbackAnalytics,
  getMissingInfoAnalytics,
};
