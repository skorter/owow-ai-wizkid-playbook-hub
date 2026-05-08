const express = require("express");
const {
  listOnboardingSteps,
  getOnboardingStep,
  createOnboardingStep,
  updateOnboardingStep,
  deleteOnboardingStep,
} = require("../controllers/onboardingController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();

const adminRoles = ["HR_ADMIN"];

router.get("/", authMiddleware, listOnboardingSteps);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(adminRoles),
  createOnboardingStep,
);

router.get("/:id", authMiddleware, getOnboardingStep);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(adminRoles),
  updateOnboardingStep,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(adminRoles),
  deleteOnboardingStep,
);

module.exports = router;
