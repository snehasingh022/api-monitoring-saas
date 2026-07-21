const requiredEnvVars = [
  'PORT',
  'AUTH_SERVICE_URL',
  'MONITOR_SERVICE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX',
  'RATE_LIMIT_AUTH_WINDOW_MS',
  'RATE_LIMIT_AUTH_MAX',
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10),
  services: {
    auth: process.env.AUTH_SERVICE_URL,
    monitor: process.env.MONITOR_SERVICE_URL,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(process.env.RATE_LIMIT_MAX, 10),
    auth: {
      windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS, 10),
      max: parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10),
    },
  },
};

module.exports = config;
