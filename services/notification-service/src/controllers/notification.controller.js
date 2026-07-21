const notificationService = require('../services/notification.service');
const asyncHandler = require('../utils/asyncHandler');

const sendAlert = asyncHandler(async (req, res) => {
  const result = await notificationService.sendStatusAlert(req.body);

  res.status(200).json({
    success: true,
    message: 'Alert notification processed successfully',
    data: { notification: result },
  });
});

module.exports = {
  sendAlert,
};
