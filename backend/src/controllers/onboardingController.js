const onboardingService = require("../services/onboardingService");

async function listOnboardingSteps(req, res, next) {
  try {
    const data = await onboardingService.getOnboardingSteps(req.user, req.query);
    return res.status(200).json({
      message: "Onboarding steps retrieved successfully",
      count: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
}

async function getOnboardingStep(req, res, next) {
  try {
    const { id } = req.params;
    const result = await onboardingService.getOnboardingStepById(id, req.user);

    if (result.notFound) {
      return res.status(404).json({
        message: "Onboarding step not found",
      });
    }

    return res.status(200).json({
      message: "Onboarding step retrieved successfully",
      data: result.step,
    });
  } catch (err) {
    next(err);
  }
}

async function createOnboardingStep(req, res, next) {
  try {
    const result = await onboardingService.createOnboardingStep(req.body || {});

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    return res.status(201).json({
      message: "Onboarding step created successfully",
      data: result.step,
    });
  } catch (err) {
    next(err);
  }
}

async function updateOnboardingStep(req, res, next) {
  try {
    const { id } = req.params;
    const result = await onboardingService.updateOnboardingStep(
      id,
      req.body || {},
    );

    if (result.notFound) {
      return res.status(404).json({
        message: "Onboarding step not found",
      });
    }

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message,
      });
    }

    return res.status(200).json({
      message: "Onboarding step updated successfully",
      data: result.step,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteOnboardingStep(req, res, next) {
  try {
    const { id } = req.params;
    const result = await onboardingService.deleteOnboardingStep(id);

    if (result.notFound) {
      return res.status(404).json({
        message: "Onboarding step not found",
      });
    }

    return res.status(200).json({
      message: "Onboarding step deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listOnboardingSteps,
  getOnboardingStep,
  createOnboardingStep,
  updateOnboardingStep,
  deleteOnboardingStep,
};
