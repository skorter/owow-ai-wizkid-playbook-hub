const { prisma } = require("../config/prisma");

function getHealth(req, res) {
  res.status(200).json({
    success: true,
    message: "OWOW Playbook AI backend is running",
    timestamp: new Date().toISOString(),
  });
}

async function getDatabaseHealth(req, res, next) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Database connection is healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}

module.exports = { getHealth, getDatabaseHealth };
