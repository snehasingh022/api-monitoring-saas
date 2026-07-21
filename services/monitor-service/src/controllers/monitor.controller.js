const monitorService = require('../services/monitor.service');
const asyncHandler = require('../utils/asyncHandler');

const createMonitor = asyncHandler(async (req, res) => {
  const monitor = await monitorService.createMonitor(req.user.id, {
    ...req.body,
    alertEmail: req.body.alertEmail || req.user.email,
  });

  res.status(201).json({
    success: true,
    message: 'Monitor created successfully',
    data: { monitor },
  });
});

const listMonitors = asyncHandler(async (req, res) => {
  const monitors = await monitorService.listMonitors(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Monitors retrieved successfully',
    data: { monitors },
  });
});

const getMonitor = asyncHandler(async (req, res) => {
  const monitor = await monitorService.getMonitor(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Monitor retrieved successfully',
    data: { monitor },
  });
});

const getMonitorHistory = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const offset = parseInt(req.query.offset, 10) || 0;

  const result = await monitorService.getMonitorHistory(req.user.id, req.params.id, {
    limit,
    offset,
  });

  res.status(200).json({
    success: true,
    message: 'Monitor history retrieved successfully',
    data: result,
  });
});

const deleteMonitor = asyncHandler(async (req, res) => {
  await monitorService.deleteMonitor(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Monitor deleted successfully',
  });
});

module.exports = {
  createMonitor,
  listMonitors,
  getMonitor,
  getMonitorHistory,
  deleteMonitor,
};
