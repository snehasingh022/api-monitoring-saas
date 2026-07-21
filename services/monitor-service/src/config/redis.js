const Redis = require('ioredis');
const config = require('./index');

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

const connectRedis = async () => {
  await redis.ping();
  console.log('Redis connected successfully');
};

module.exports = { redis, connectRedis };
