const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { dashboardQueryRules } = require('../validators/dashboard.validator');

const router = express.Router();

router.use(authenticate);

router.get('/', dashboardQueryRules, validate, dashboardController.getDashboard);

module.exports = router;
