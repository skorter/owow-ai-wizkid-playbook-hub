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

module.exports = { getCategories, getCategory };
