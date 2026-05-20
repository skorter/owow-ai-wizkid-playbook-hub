const profileService = require("../services/profileService");

async function getActivity(req, res, next) {
  try {
    const userId = req.user?.id ?? null;
    const result = await profileService.getProfileActivity(userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getInsights(req, res, next) {
  try {
    const userId = req.user?.id ?? null;
    const result = await profileService.getProfileInsights(userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getActivity,
  getInsights,
};
