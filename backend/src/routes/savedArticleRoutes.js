const express = require("express");
const {
  listSaved,
  saveArticle,
  unsaveArticle,
} = require("../controllers/savedArticleController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, listSaved);
router.post("/:articleId", authMiddleware, saveArticle);
router.delete("/:articleId", authMiddleware, unsaveArticle);

module.exports = router;
