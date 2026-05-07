const express = require("express");
const {
  getArticles,
  getArticle,
  getArticleBySlugParam,
} = require("../controllers/articleController");

const router = express.Router();

// slug route must come before /:id so "slug" is not interpreted as id
router.get("/slug/:slug", getArticleBySlugParam);

router.get("/", getArticles);

router.get("/:id", getArticle);

module.exports = router;
