const AppError = require('../utils/AppError');
const config = require('../config');

/**
 * Protects internal endpoints called by other microservices.
 * Expects header: X-Internal-Api-Key
 */
const internalAuth = (req, res, next) => {
  const apiKey = req.headers['x-internal-api-key'];

  if (!apiKey || apiKey !== config.internalApiKey) {
    return next(new AppError('Unauthorized internal request', 401));
  }

  next();
};

module.exports = internalAuth;
