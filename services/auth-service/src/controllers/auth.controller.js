const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user },
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, tokens },
  });
});

module.exports = {
  register,
  login,
};
