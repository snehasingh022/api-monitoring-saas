const express = require('express');
const { verifyTransport } = require('../services/email.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const email = await verifyTransport();

    res.status(200).json({
      success: true,
      service: 'notification-service',
      status: 'healthy',
      email,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    err.statusCode = 503;
    err.message = `Email transport unavailable: ${err.message}`;
    next(err);
  }
});

module.exports = router;
