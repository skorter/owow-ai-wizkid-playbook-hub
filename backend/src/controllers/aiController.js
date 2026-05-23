const aiService = require("../services/aiService");

async function getAIStatus(req, res, next) {
  try {
    const status = aiService.getAIStatus();
    return res.status(200).json(status);
  } catch (err) {
    next(err);
  }
}

async function aiSearch(req, res, next) {
  try {
    const { question } = req.body || {};
    const userId = req.user?.id ?? null;
    const result = await aiService.runAISearch(question, userId);

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function aiRecentSearches(req, res, next) {
  try {
    const userId = req.user?.id ?? null;
    const result = await aiService.getRecentSearchesForUser(
      userId,
      req.query?.limit,
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function aiAskPage(req, res, next) {
  try {
    const userId = req.user?.id ?? null;
    const result = await aiService.runAskPageAI(req.body || {}, userId);

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function aiReady(req, res) {
  const status = aiService.getAIStatus();
  res.status(200).json({
    success: true,
    message: status.configured
      ? "AI module is configured"
      : "AI module is in fallback mode",
    ...status,
  });
}

module.exports = {
  getAIStatus,
  aiSearch,
  aiAskPage,
  aiRecentSearches,
  aiReady,
};
