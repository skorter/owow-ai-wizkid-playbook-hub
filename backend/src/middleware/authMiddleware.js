function requireAuth(req, res, next) {
  // Phase 2 placeholder: authentication will be implemented later.
  // Do NOT block requests during setup.
  return next();
}

module.exports = { requireAuth };

