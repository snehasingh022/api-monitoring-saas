const requiredEnvVars = [
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'MONITOR_CRON_SCHEDULE',
  'MONITOR_CHECK_TIMEOUT_MS',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'LATEST_RESULT_TTL_SECONDS',
  'DASHBOARD_TTL_SECONDS',
  'NOTIFICATION_SERVICE_URL',
  'INTERNAL_API_KEY',
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  worker: {
    cronSchedule: process.env.MONITOR_CRON_SCHEDULE,
    checkTimeoutMs: parseInt(process.env.MONITOR_CHECK_TIMEOUT_MS, 10),
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
    latestResultTtlSeconds: parseInt(process.env.LATEST_RESULT_TTL_SECONDS, 10),
    dashboardTtlSeconds: parseInt(process.env.DASHBOARD_TTL_SECONDS, 10),
  },
  notification: {
    serviceUrl: process.env.NOTIFICATION_SERVICE_URL.replace(/\/$/, ''),
    internalApiKey: process.env.INTERNAL_API_KEY,
  },
};

module.exports = config;
