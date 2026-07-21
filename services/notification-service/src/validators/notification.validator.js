const { body } = require('express-validator');

const alertRules = [
  body('to')
    .trim()
    .notEmpty()
    .withMessage('Recipient email is required')
    .isEmail()
    .withMessage('A valid recipient email is required')
    .normalizeEmail(),
  body('monitorName')
    .trim()
    .notEmpty()
    .withMessage('Monitor name is required')
    .isLength({ max: 100 })
    .withMessage('Monitor name must be at most 100 characters'),
  body('monitorUrl')
    .trim()
    .notEmpty()
    .withMessage('Monitor URL is required')
    .isURL({ require_protocol: true })
    .withMessage('A valid monitor URL is required'),
  body('previousStatus')
    .optional({ nullable: true })
    .isIn(['up', 'down', 'unknown'])
    .withMessage('previousStatus must be up, down, or unknown'),
  body('currentStatus')
    .trim()
    .notEmpty()
    .withMessage('currentStatus is required')
    .isIn(['up', 'down'])
    .withMessage('currentStatus must be up or down'),
  body('statusCode')
    .optional({ nullable: true })
    .isInt({ min: 100, max: 599 })
    .withMessage('statusCode must be a valid HTTP status code'),
  body('responseTimeMs')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('responseTimeMs must be a non-negative integer'),
  body('checkedAt')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('checkedAt must be a valid ISO 8601 datetime'),
  body('errorMessage')
    .optional({ nullable: true })
    .isString()
    .withMessage('errorMessage must be a string'),
];

module.exports = {
  alertRules,
};
