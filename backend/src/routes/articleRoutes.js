const express = require("express");
const {
  getArticles,
  getArticle,
  getArticleBySlugParam,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();

// Public reads — /slug/:slug must be before /:id
router.get("/", getArticles);
router.get("/slug/:slug", getArticleBySlugParam);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("HR_ADMIN"),
  createArticle,
);

router.get("/:id", getArticle);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("HR_ADMIN"),
  updateArticle,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("HR_ADMIN"),
  deleteArticle,
);

module.exports = router;
