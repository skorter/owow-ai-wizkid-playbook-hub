function onboardingReady(req, res) {
  res.status(200).json({
    success: true,
    message: "Onboarding module is ready",
  });
}

module.exports = { onboardingReady };

