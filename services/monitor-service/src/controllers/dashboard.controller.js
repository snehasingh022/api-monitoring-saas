const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const lookbackHours = parseInt(req.query.hours, 10) || 24;

  const dashboard = await dashboardService.getDashboardForUser(
    req.user.id,
    lookbackHours
  );

  res.status(200).json({
    success: true,
    message: 'Dashboard retrieved successfully',
    data: dashboard,
  });
});

module.exports = {
  getDashboard,
};
