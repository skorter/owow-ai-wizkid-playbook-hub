const feedbackService = require("../services/feedbackService");

async function submitFeedback(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await feedbackService.createFeedback(req.body, userId);

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    return res.status(201).json({
      message: "Feedback submitted successfully",
      data: result.feedback,
    });
  } catch (err) {
    next(err);
  }
}

async function listFeedback(req, res, next) {
  try {
    const data = await feedbackService.listFeedback();
    return res.status(200).json({
      message: "Feedback retrieved successfully",
      data,
      count: data.length,
    });
  } catch (err) {
    next(err);
  }
}

async function getFeedback(req, res, next) {
  try {
    const { id } = req.params;
    const item = await feedbackService.getFeedbackById(id);

    if (!item) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.status(200).json({
      message: "Feedback retrieved successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
}

async function updateFeedback(req, res, next) {
  try {
    const { id } = req.params;
    const result = await feedbackService.updateFeedback(id, req.body || {});

    if (result.notFound) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    return res.status(200).json({
      message: "Feedback updated successfully",
      data: result.feedback,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteFeedback(req, res, next) {
  try {
    const { id } = req.params;
    const result = await feedbackService.deleteFeedback(id);

    if (result.notFound) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.status(200).json({
      message: "Feedback deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitFeedback,
  listFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
