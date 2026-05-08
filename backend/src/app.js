const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const aiRoutes = require("./routes/aiRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const missingInfoRoutes = require("./routes/missingInfoRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const { notFound, errorMiddleware } = require("./middleware/errorMiddleware");

function createApp() {
  const app = express();

  // Parse JSON request bodies
  app.use(express.json());

  // Allow cross-origin requests (configure tighter later if needed)
  app.use(cors());

  app.get("/", (req, res) => {
    res.json({
      success: true,
      project: "OWOW Playbook AI",
      version: "1.0.0",
      status: "API is running",
    });
  });

  // Routes
  app.use("/api/health", healthRoutes);
  // Auth: POST /register, POST /login, GET /me
  app.use("/api/auth", authRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/missing-info", missingInfoRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/onboarding", onboardingRoutes);

  // 404 handler for unknown routes
  app.use(notFound);

  // Centralized error handling (must be last)
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
