const articleService = require("../services/articleService");

async function getArticles(req, res, next) {
  try {
    const filters = {
      category: req.query.category,
      search: req.query.search,
    };
    const data = await articleService.getAllArticles(filters);
    res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (err) {
    next(err);
  }
}

async function getAdminArticles(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      category: req.query.category,
      search: req.query.search,
    };
    const result = await articleService.getAdminArticles(filters);

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    const data = result.articles;
    return res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (err) {
    next(err);
  }
}

async function getAdminArticle(req, res, next) {
  try {
    const { id } = req.params;
    const result = await articleService.getAdminArticleById(id);

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.article,
    });
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

async function createArticle(req, res, next) {
  try {
    const authorId = req.user?.id;
    const result = await articleService.createArticle(req.body, authorId);

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data: result.article,
    });
  } catch (err) {
    next(err);
  }
}

async function updateArticle(req, res, next) {
  try {
    const { id } = req.params;
    const result = await articleService.updateArticle(id, req.body);

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.article,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteArticle(req, res, next) {
  try {
    const { id } = req.params;
    const result = await articleService.deleteArticle(id);

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getArticles,
  getAdminArticles,
  getAdminArticle,
  getArticle,
  getArticleBySlugParam,
  createArticle,
  updateArticle,
  deleteArticle,
};
