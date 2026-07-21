const createRateLimiter = require('../middlewares/rateLimiter');
const config = require('../config');

const globalRateLimiter = createRateLimiter({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  keyPrefix: 'ratelimit:global',
  shouldLimit: (req) => req.path !== '/health',
});

const authRateLimiter = createRateLimiter({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  keyPrefix: 'ratelimit:auth',
  shouldLimit: (req) =>
    req.method === 'POST' &&
    (req.path === '/api/auth/login' || req.path === '/api/auth/register'),
});

module.exports = {
  globalRateLimiter,
  authRateLimiter,
};
