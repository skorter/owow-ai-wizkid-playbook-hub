const onboardingService = require("../services/onboardingService");

async function getOnboarding(req, res, next) {
  try {
    const data = await onboardingService.getAllOnboardingSteps();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOnboarding };
