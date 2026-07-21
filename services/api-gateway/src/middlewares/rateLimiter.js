const { redis } = require('../config/redis');
const AppError = require('../utils/AppError');

const getClientIp = (req) => {
  return req.ip || req.socket.remoteAddress || 'unknown';
};

const createRateLimiter = ({ windowMs, max, keyPrefix, shouldLimit }) => {
  return async (req, res, next) => {
    if (!shouldLimit(req)) {
      return next();
    }

    const ip = getClientIp(req);
    const key = `${keyPrefix}:${ip}`;

    try {
      const count = await redis.incr(key);

      if (count === 1) {
        await redis.pexpire(key, windowMs);
      }

      const ttl = await redis.pttl(key);
      const resetTime = Math.ceil((Date.now() + Math.max(ttl, 0)) / 1000);

      res.setHeader('RateLimit-Limit', max);
      res.setHeader('RateLimit-Remaining', Math.max(0, max - count));
      res.setHeader('RateLimit-Reset', resetTime);

      if (count > max) {
        return next(
          new AppError('Too many requests, please try again later', 429)
        );
      }

      next();
    } catch (err) {
      console.error('Rate limiter Redis error:', err.message);
      next();
    }
  };
};

module.exports = createRateLimiter;
