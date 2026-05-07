function getHealth(req, res) {
  res.status(200).json({
    success: true,
    message: "OWOW Playbook AI backend is running",
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
