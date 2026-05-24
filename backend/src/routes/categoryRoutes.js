const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("HR_ADMIN"),
  createCategory,
);

router.get("/:id", getCategory);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("HR_ADMIN"),
  updateCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("HR_ADMIN"),
  deleteCategory,
);

module.exports = router;
