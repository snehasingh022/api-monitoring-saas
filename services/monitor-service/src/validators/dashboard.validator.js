const { query } = require('express-validator');

const dashboardQueryRules = [
  query('hours')
    .optional()
    .isInt({ min: 1, max: 168 })
    .withMessage('Hours must be between 1 and 168 (7 days)'),
];

module.exports = {
  dashboardQueryRules,
};
