function aiReady(req, res) {
  res.status(200).json({
    success: true,
    message: "AI module is ready",
  });
}

module.exports = { aiReady };

