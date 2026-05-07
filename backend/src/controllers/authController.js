function authReady(req, res) {
  res.status(200).json({
    success: true,
    message: "Auth module is ready",
  });
}

module.exports = { authReady };

