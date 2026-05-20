const authService = require("../services/authService");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body || {});

    if (!result.ok) {
      return res.status(result.status).json(result.body);
    }

    return res.status(201).json({
      success: true,
      data: result.data,
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body || {});

    if (!result.ok) {
      return res.status(result.status).json(result.body);
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (err) {
    return next(err);
  }
}

function me(req, res) {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
}

async function updateProfile(req, res, next) {
  try {
    const result = await authService.updateMe(req.user.id, req.body || {});

    if (!result.ok) {
      return res.status(result.status).json(result.body);
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.data,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me, updateProfile };
