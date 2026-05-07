function requireRole(role) {
  // Phase 2 placeholder: role checks will be implemented later.
  // Do NOT block requests during setup.
  return function roleMiddleware(req, res, next) {
    return next();
  };
}

module.exports = { requireRole };

