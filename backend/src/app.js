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
const profileRoutes = require("./routes/profileRoutes");
const savedArticleRoutes = require("./routes/savedArticleRoutes");
const { notFound, errorMiddleware } = require("./middleware/errorMiddleware");

function createApp() {
  const app = express();

  app.use(express.json());

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
    "http://localhost:3000",
  ]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/+$/, ""));

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: false,
    }),
  );

  app.get("/", (req, res) => {
    res.json({
      success: true,
      project: "OWOW Playbook AI",
      version: "1.0.0",
      status: "API is running",
    });
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/missing-info", missingInfoRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/onboarding", onboardingRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/saved-articles", savedArticleRoutes);

  app.use(notFound);

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
