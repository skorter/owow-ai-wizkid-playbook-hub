function feedbackReady(req, res) {
  res.status(200).json({
    success: true,
    message: "Feedback module is ready",
  });
}

module.exports = { feedbackReady };

