function articleReady(req, res) {
  res.status(200).json({
    success: true,
    message: "Article module is ready",
  });
}

module.exports = { articleReady };

