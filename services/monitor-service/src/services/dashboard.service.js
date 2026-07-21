const Dashboard = require('../models/Dashboard');
const {
  getDashboard,
  setDashboard,
  deleteDashboard,
} = require('./monitorCache.service');

const calcUptimePercent = (upChecks, totalChecks) => {
  if (totalChecks === 0) {
    return null;
  }

  return Math.round((upChecks / totalChecks) * 10000) / 100;
};

const buildDashboard = (rows, lookbackHours) => {
  const monitors = rows.map((row) => {
    const uptimePercent = calcUptimePercent(row.up_checks, row.total_checks);
    const estimatedDowntimeMinutes =
      row.down_checks * (row.interval_minutes || 0);

    return {
      id: row.id,
      name: row.name,
      url: row.url,
      method: row.method,
      intervalMinutes: row.interval_minutes,
      isActive: row.is_active,
      currentStatus: row.current_status || 'unknown',
      uptimePercent,
      downtime: {
        checkCount: row.down_checks,
        estimatedMinutes: estimatedDowntimeMinutes,
      },
      avgResponseTimeMs: row.avg_response_time_ms,
      lastStatusCode: row.last_status_code,
      lastResponseTimeMs: row.last_response_time_ms,
      lastCheckedAt: row.last_checked_at,
      lastErrorMessage: row.last_error_message,
      checksInWindow: {
        total: row.total_checks,
        up: row.up_checks,
        down: row.down_checks,
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

  const totalMonitors = monitors.length;
  const upCount = monitors.filter((m) => m.currentStatus === 'up').length;
  const downCount = monitors.filter((m) => m.currentStatus === 'down').length;
  const unknownCount = monitors.filter((m) => m.currentStatus === 'unknown').length;

  const totalChecks = monitors.reduce((sum, m) => sum + m.checksInWindow.total, 0);
  const totalUp = monitors.reduce((sum, m) => sum + m.checksInWindow.up, 0);
  const totalDown = monitors.reduce((sum, m) => sum + m.checksInWindow.down, 0);

  const responseSamples = monitors
    .map((m) => m.avgResponseTimeMs)
    .filter((v) => v !== null && v !== undefined);

  const overallAvgResponseTimeMs =
    responseSamples.length > 0
      ? Math.round(
          responseSamples.reduce((sum, v) => sum + v, 0) / responseSamples.length
        )
      : null;

  return {
    summary: {
      totalMonitors,
      upCount,
      downCount,
      unknownCount,
      overallUptimePercent: calcUptimePercent(totalUp, totalChecks),
      overallAvgResponseTimeMs,
      checksInWindow: {
        total: totalChecks,
        up: totalUp,
        down: totalDown,
      },
      lookbackHours,
    },
    monitors,
    generatedAt: new Date().toISOString(),
  };
};

const getDashboardForUser = async (userId, lookbackHours = 24) => {
  const cacheKeyHours = lookbackHours;
  const cached = await getDashboard(`${userId}:${cacheKeyHours}`);

  if (cached) {
    return { ...cached, fromCache: true };
  }

  const rows = await Dashboard.getUserAggregation(userId, lookbackHours);
  const dashboard = buildDashboard(rows, lookbackHours);

  await setDashboard(`${userId}:${cacheKeyHours}`, dashboard);

  return { ...dashboard, fromCache: false };
};

const invalidateDashboard = async (userId) => {
  // Clear common lookback windows used by the API
  await Promise.all([
    deleteDashboard(`${userId}:24`),
    deleteDashboard(`${userId}:1`),
    deleteDashboard(`${userId}:12`),
    deleteDashboard(`${userId}:48`),
    deleteDashboard(`${userId}:168`),
  ]);
};

module.exports = {
  getDashboardForUser,
  invalidateDashboard,
};
