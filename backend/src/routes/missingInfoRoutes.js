const express = require("express");
const {
  submitMissingInfo,
  listMissingInfo,
  getMissingInfo,
  updateMissingInfo,
  deleteMissingInfo,
} = require("../controllers/missingInfoController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();

const adminRoles = ["HR_ADMIN"];

router.post("/", authMiddleware, submitMissingInfo);
router.get("/", authMiddleware, roleMiddleware(adminRoles), listMissingInfo);

router.get("/:id", authMiddleware, roleMiddleware(adminRoles), getMissingInfo);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(adminRoles),
  updateMissingInfo,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(adminRoles),
  deleteMissingInfo,
);

module.exports = router;
