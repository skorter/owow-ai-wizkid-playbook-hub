const express = require("express");
const {
  getArticles,
  getAdminArticles,
  getAdminArticle,
  getArticle,
  getArticleBySlugParam,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = express.Router();
const hrAdminOnly = [authMiddleware, roleMiddleware("HR_ADMIN")];

router.get("/", getArticles);
router.get("/slug/:slug", getArticleBySlugParam);

router.get("/admin/all", ...hrAdminOnly, getAdminArticles);
router.get("/admin/:id", ...hrAdminOnly, getAdminArticle);

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
