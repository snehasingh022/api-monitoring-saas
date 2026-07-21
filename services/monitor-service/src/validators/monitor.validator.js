const { body, param, query } = require('express-validator');

const createMonitorRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL({ require_protocol: true })
    .withMessage('A valid URL with protocol (http/https) is required'),
  body('method')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(['GET', 'POST', 'HEAD'])
    .withMessage('Method must be GET, POST, or HEAD'),
  body('intervalMinutes')
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage('Interval must be between 1 and 60 minutes'),
    
  body('alertEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('A valid alert email is required')
    .normalizeEmail(),
];

const monitorIdRules = [
  param('id').isUUID().withMessage('A valid monitor ID is required'),
];

const historyQueryRules = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
];

module.exports = {
  createMonitorRules,
  monitorIdRules,
  historyQueryRules,
};
