function categoryReady(req, res) {
  res.status(200).json({
    success: true,
    message: "Category module is ready",
  });
}

module.exports = { categoryReady };

