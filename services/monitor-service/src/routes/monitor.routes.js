const express = require('express');
const monitorController = require('../controllers/monitor.controller');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const {
  createMonitorRules,
  monitorIdRules,
  historyQueryRules,
} = require('../validators/monitor.validator');

const router = express.Router();

router.use(authenticate);

router.post('/', createMonitorRules, validate, monitorController.createMonitor);
router.get('/', monitorController.listMonitors);
router.get(
  '/:id/history',
  monitorIdRules,
  historyQueryRules,
  validate,
  monitorController.getMonitorHistory
);
router.get('/:id', monitorIdRules, validate, monitorController.getMonitor);
router.delete('/:id', monitorIdRules, validate, monitorController.deleteMonitor);

module.exports = router;
