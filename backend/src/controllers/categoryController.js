const categoryService = require("../services/categoryService");

async function getCategories(req, res, next) {
  try {
    const data = await categoryService.getAllCategories();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getCategory(req, res, next) {
  try {
    const { id } = req.params;
    const data = await categoryService.getCategoryById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const result = await categoryService.createCategory(req.body);

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data: result.category,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const result = await categoryService.updateCategory(id, req.body);

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
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
      data: result.category,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
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
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
