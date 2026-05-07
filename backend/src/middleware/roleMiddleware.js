/**
 * Require one of the allowed roles. Use after `authMiddleware`.
 * @param {string | string[]} allowedRoles
 */
function roleMiddleware(allowedRoles) {
  const allowed = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  return function roleCheck(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return next();
  };
}

module.exports = { roleMiddleware };
