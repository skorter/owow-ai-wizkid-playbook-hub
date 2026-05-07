function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

function errorMiddleware(err, req, res, next) {
  // If a route handler calls next() with no error, skip this middleware.
  if (!err) return next();

  const statusCode = Number(err.statusCode) || 500;

  // Beginner-friendly: log server errors. (You can improve logging later.)
  console.error(err);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
}

module.exports = { notFound, errorMiddleware };

