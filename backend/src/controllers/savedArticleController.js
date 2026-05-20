const savedArticleService = require("../services/savedArticleService");

async function listSaved(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await savedArticleService.listSavedArticles(userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function saveArticle(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const articleId = req.params.articleId;
    const result = await savedArticleService.saveArticleForUser(userId, articleId);
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function unsaveArticle(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const articleId = req.params.articleId;
    const result = await savedArticleService.removeSavedArticle(userId, articleId);
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listSaved,
  saveArticle,
  unsaveArticle,
};
