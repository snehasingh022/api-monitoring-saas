const express = require('express');
const { testConnection } = require('../database/connection');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await testConnection();

    res.status(200).json({
      success: true,
      service: 'auth-service',
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    err.statusCode = 503;
    err.message = 'Database connection failed';
    next(err);
  }
});

module.exports = router;
