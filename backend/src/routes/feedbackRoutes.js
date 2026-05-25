const express = require("express");
const {
  submitFeedback,
  listFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();

const adminRoles = ["HR_ADMIN"];

router.post("/", authMiddleware, submitFeedback);
router.get("/", authMiddleware, roleMiddleware(adminRoles), listFeedback);

router.get("/:id", authMiddleware, roleMiddleware(adminRoles), getFeedback);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(adminRoles),
  updateFeedback,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(adminRoles),
  deleteFeedback,
);

module.exports = router;
