const express = require('express');
const notificationController = require('../controllers/notification.controller');
const internalAuth = require('../middlewares/internalAuth');
const validate = require('../middlewares/validate');
const { alertRules } = require('../validators/notification.validator');

const router = express.Router();

router.post(
  '/alert',
  internalAuth,
  alertRules,
  validate,
  notificationController.sendAlert
);

module.exports = router;
