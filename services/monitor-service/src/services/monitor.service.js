const Monitor = require('../models/Monitor');
const CheckHistory = require('../models/CheckHistory');
const AppError = require('../utils/AppError');
const {
  getLatestResult,
  getLatestResults,
  setLatestResult,
  deleteLatestResult,
} = require('./monitorCache.service');
const { invalidateDashboard } = require('./dashboard.service');

const createMonitor = async (
  userId,
  { name, url, method, intervalMinutes, alertEmail }
) => {
  const monitor = await Monitor.create({
    userId,
    name: name.trim(),
    url: url.trim(),
    method: method || 'GET',
    intervalMinutes: intervalMinutes || 5,
    alertEmail: alertEmail ? alertEmail.trim().toLowerCase() : null,
  });

  await invalidateDashboard(userId);

  return Monitor.toPublic(monitor);
};

const attachLatestResult = async (monitor) => {
  const publicMonitor = Monitor.toPublic(monitor);

  let latest = await getLatestResult(monitor.id);

  if (!latest) {
    const fromDb = await CheckHistory.findLatestByMonitorId(monitor.id);
    latest = CheckHistory.toPublic(fromDb);

    if (latest) {
      await setLatestResult(monitor.id, latest);
    }
  }

  return {
    ...publicMonitor,
    latestCheck: latest,
  };
};

const listMonitors = async (userId) => {
  const monitors = await Monitor.findByUserId(userId);

  if (monitors.length === 0) {
    return [];
  }

  const ids = monitors.map((m) => m.id);
  const cachedMap = await getLatestResults(ids);

  const missingIds = ids.filter((id) => !cachedMap[id]);
  const dbLatestMap = {};

  if (missingIds.length > 0) {
    const rows = await CheckHistory.findLatestByMonitorIds(missingIds);

    for (const row of rows) {
      const publicResult = CheckHistory.toPublic(row);
      dbLatestMap[row.monitor_id] = publicResult;
      await setLatestResult(row.monitor_id, publicResult);
    }
  }

  return monitors.map((monitor) => ({
    ...Monitor.toPublic(monitor),
    latestCheck: cachedMap[monitor.id] || dbLatestMap[monitor.id] || null,
  }));
};

const getMonitor = async (userId, monitorId) => {
  const monitor = await Monitor.findByIdAndUserId(monitorId, userId);

  if (!monitor) {
    throw new AppError('Monitor not found', 404);
  }

  return attachLatestResult(monitor);
};

const getMonitorHistory = async (userId, monitorId, { limit = 50, offset = 0 } = {}) => {
  const monitor = await Monitor.findByIdAndUserId(monitorId, userId);

  if (!monitor) {
    throw new AppError('Monitor not found', 404);
  }

  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safeOffset = Math.max(offset, 0);

  const [rows, total] = await Promise.all([
    CheckHistory.findByMonitorId(monitorId, {
      limit: safeLimit,
      offset: safeOffset,
    }),
    CheckHistory.countByMonitorId(monitorId),
  ]);

  return {
    monitor: Monitor.toPublic(monitor),
    history: rows.map(CheckHistory.toPublic),
    pagination: {
      total,
      limit: safeLimit,
      offset: safeOffset,
    },
  };
};

const deleteMonitor = async (userId, monitorId) => {
  const deleted = await Monitor.deleteByIdAndUserId(monitorId, userId);

  if (!deleted) {
    throw new AppError('Monitor not found', 404);
  }

  await deleteLatestResult(monitorId);
  await invalidateDashboard(userId);
};

module.exports = {
  createMonitor,
  listMonitors,
  getMonitor,
  getMonitorHistory,
  deleteMonitor,
};
