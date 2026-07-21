const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const {
  registerRules,
  loginRules,
  refreshRules,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/refresh', refreshRules, validate, authController.refresh);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
