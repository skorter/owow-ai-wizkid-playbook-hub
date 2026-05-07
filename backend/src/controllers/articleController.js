const articleService = require("../services/articleService");

async function getArticles(req, res, next) {
  try {
    const data = await articleService.getAllArticles();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getArticle(req, res, next) {
  try {
    const { id } = req.params;
    const data = await articleService.getArticleById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getArticleBySlugParam(req, res, next) {
  try {
    const { slug } = req.params;
    const data = await articleService.getArticleBySlug(slug);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getArticles, getArticle, getArticleBySlugParam };
