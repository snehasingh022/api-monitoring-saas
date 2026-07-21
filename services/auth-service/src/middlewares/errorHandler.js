const errorHandler = (err, req, res, next) => {
  console.error(`[${req.method}] ${req.originalUrl} —`, err.message);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
