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
    const result = await aiService.runPlaceholderSearch(question);

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
  aiReady,
};
