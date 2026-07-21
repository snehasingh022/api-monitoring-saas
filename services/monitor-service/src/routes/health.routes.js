const express = require('express');
const { testConnection } = require('../database/connection');
const { redis } = require('../config/redis');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await testConnection();

    let redisStatus = 'connected';
    try {
      await redis.ping();
    } catch {
      redisStatus = 'disconnected';
    }

    res.status(200).json({
      success: true,
      service: 'monitor-service',
      status: 'healthy',
      database: 'connected',
      redis: redisStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    err.statusCode = 503;
    err.message = 'Database connection failed';
    next(err);
  }
});

module.exports = router;
