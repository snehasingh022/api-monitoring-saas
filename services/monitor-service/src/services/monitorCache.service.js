const { redis } = require('../config/redis');
const config = require('../config');

const latestKey = (monitorId) => `monitor:latest:${monitorId}`;
const dashboardKey = (userId) => `dashboard:${userId}`;

/**
 * Cache the latest check result for a monitor.
 * Failures are logged but never block the health-check pipeline.
 */
const setLatestResult = async (monitorId, result) => {
  try {
    await redis.set(
      latestKey(monitorId),
      JSON.stringify(result),
      'EX',
      config.redis.latestResultTtlSeconds
    );
  } catch (err) {
    console.error(`Failed to cache latest result for ${monitorId}:`, err.message);
  }
};

const getLatestResult = async (monitorId) => {
  try {
    const cached = await redis.get(latestKey(monitorId));
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error(`Failed to read latest result for ${monitorId}:`, err.message);
    return null;
  }
};

const getLatestResults = async (monitorIds) => {
  if (!monitorIds.length) {
    return {};
  }

  try {
    const keys = monitorIds.map(latestKey);
    const values = await redis.mget(...keys);
    const map = {};

    monitorIds.forEach((id, index) => {
      if (values[index]) {
        map[id] = JSON.parse(values[index]);
      }
    });

    return map;
  } catch (err) {
    console.error('Failed to read latest results batch:', err.message);
    return {};
  }
};

const deleteLatestResult = async (monitorId) => {
  try {
    await redis.del(latestKey(monitorId));
  } catch (err) {
    console.error(`Failed to delete latest result for ${monitorId}:`, err.message);
  }
};

const getDashboard = async (userId) => {
  try {
    const cached = await redis.get(dashboardKey(userId));
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error(`Failed to read dashboard cache for ${userId}:`, err.message);
    return null;
  }
};

const setDashboard = async (userId, payload) => {
  try {
    await redis.set(
      dashboardKey(userId),
      JSON.stringify(payload),
      'EX',
      config.redis.dashboardTtlSeconds
    );
  } catch (err) {
    console.error(`Failed to cache dashboard for ${userId}:`, err.message);
  }
};

const deleteDashboard = async (userId) => {
  try {
    await redis.del(dashboardKey(userId));
  } catch (err) {
    console.error(`Failed to delete dashboard cache for ${userId}:`, err.message);
  }
};

module.exports = {
  setLatestResult,
  getLatestResult,
  getLatestResults,
  deleteLatestResult,
  getDashboard,
  setDashboard,
  deleteDashboard,
};
