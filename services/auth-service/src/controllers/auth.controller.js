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

const refresh = asyncHandler(async (req, res) => {
  const { tokens } = await authService.refresh(req.body);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: { tokens },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: { user },
  });
});

module.exports = {
  register,
  login,
  refresh,
  getProfile,
};
