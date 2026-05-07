function analyticsReady(req, res) {
  res.status(200).json({
    success: true,
    message: "Analytics module is ready",
  });
}

module.exports = { analyticsReady };

