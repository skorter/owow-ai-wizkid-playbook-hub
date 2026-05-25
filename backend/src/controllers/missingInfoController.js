const missingInfoService = require("../services/missingInfoService");

async function submitMissingInfo(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await missingInfoService.createMissingInfoReport(
      req.body,
      userId,
    );

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    return res.status(201).json({
      message: "Missing information report submitted successfully",
      data: result.report,
    });
  } catch (err) {
    next(err);
  }
}

async function listMissingInfo(req, res, next) {
  try {
    const result = await missingInfoService.listMissingInfoReports({
      status: req.query.status,
    });

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    const { reports } = result;
    return res.status(200).json({
      message: "Missing information reports retrieved successfully",
      data: reports,
      count: reports.length,
    });
  } catch (err) {
    next(err);
  }
}

async function getMissingInfo(req, res, next) {
  try {
    const { id } = req.params;
    const item = await missingInfoService.getMissingInfoReportById(id);

    if (!item) {
      return res
        .status(404)
        .json({ message: "Missing information report not found" });
    }

    return res.status(200).json({
      message: "Missing information report retrieved successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
}

async function updateMissingInfo(req, res, next) {
  try {
    const { id } = req.params;
    const result = await missingInfoService.updateMissingInfoReport(
      id,
      req.body || {},
    );

    if (result.notFound) {
      return res
        .status(404)
        .json({ message: "Missing information report not found" });
    }

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    return res.status(200).json({
      message: "Missing information report updated successfully",
      data: result.report,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteMissingInfo(req, res, next) {
  try {
    const { id } = req.params;
    const result = await missingInfoService.deleteMissingInfoReport(id);

    if (result.notFound) {
      return res
        .status(404)
        .json({ message: "Missing information report not found" });
    }

    return res.status(200).json({
      message: "Missing information report deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitMissingInfo,
  listMissingInfo,
  getMissingInfo,
  updateMissingInfo,
  deleteMissingInfo,
};
