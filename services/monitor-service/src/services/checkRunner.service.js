const Monitor = require('../models/Monitor');
const CheckHistory = require('../models/CheckHistory');
const { pool } = require('../database/connection');
const { performHealthCheck } = require('./healthCheck.service');
const { setLatestResult } = require('./monitorCache.service');
const { invalidateDashboard } = require('./dashboard.service');
const { sendStatusChangeAlert } = require('./notificationClient.service');

const normalizePreviousStatus = (value) => {
  if (value == null || value === '') {
    return null;
  }

  return value;
};

const shouldSendAlert = (previousStatus, currentStatus) => {
  const isFirstCheck = previousStatus === null;
  const firstCheckDown = isFirstCheck && currentStatus === 'down';
  const statusChanged =
    previousStatus !== null && previousStatus !== currentStatus;

  return {
    shouldAlert: firstCheckDown || statusChanged,
    isFirstCheck,
    firstCheckDown,
    statusChanged,
  };
};

const maybeSendAlert = async (monitor, previousStatus, publicResult) => {
  const currentStatus = publicResult.status;
  const previous = normalizePreviousStatus(previousStatus);
  const decision = shouldSendAlert(previous, currentStatus);

  console.log(
    `  [ALERT CHECK] ${monitor.name} | previous=${previous ?? 'null'} | ` +
      `current=${currentStatus} | email=${monitor.alert_email || 'none'} | ` +
      `firstCheck=${decision.isFirstCheck} | changed=${decision.statusChanged} | ` +
      `firstDown=${decision.firstCheckDown}`
  );

  if (!decision.shouldAlert) {
    console.log(
      `  [ALERT SKIP] ${monitor.name}: no transition (need null→down or up↔down)`
    );
    return;
  }

  try {
    console.log(
      `  [ALERT] Sending notification for ${monitor.name}: ` +
        `${previous ?? 'unknown'} → ${currentStatus}`
    );

    const notification = await sendStatusChangeAlert({
      to: monitor.alert_email,
      monitorName: monitor.name,
      monitorUrl: monitor.url,
      previousStatus: previous || 'unknown',
      currentStatus,
      statusCode: publicResult.statusCode,
      responseTimeMs: publicResult.responseTimeMs,
      checkedAt: publicResult.checkedAt,
      errorMessage: publicResult.errorMessage,
    });

    console.log(
      `  [ALERT OK] ${monitor.name} notified` +
        (notification?.messageId ? ` (${notification.messageId})` : '')
    );
  } catch (err) {
    if (err.code === 'NO_ALERT_EMAIL') {
      console.warn(`  [ALERT SKIP] ${err.message}`);
      return;
    }

    console.error(`  [ALERT FAILED] ${monitor.name}: ${err.message}`);
  }
};

/**
 * Persist check under a row lock so concurrent cycles cannot both
 * read previous=null and send duplicate unknown→down alerts.
 */
const saveCheckWithPreviousStatus = async (monitorId, result) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Serialize checks for this monitor across workers/cycles
    await client.query('SELECT id FROM monitors WHERE id = $1 FOR UPDATE', [
      monitorId,
    ]);

    const previousResult = await client.query(
      `SELECT status
       FROM check_history
       WHERE monitor_id = $1
       ORDER BY checked_at DESC
       LIMIT 1`,
      [monitorId]
    );

    const previousStatus = normalizePreviousStatus(
      previousResult.rows[0]?.status
    );

    const insertResult = await client.query(
      `INSERT INTO check_history
         (monitor_id, status, status_code, response_time_ms, error_message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, monitor_id, status, status_code, response_time_ms, checked_at, error_message`,
      [
        monitorId,
        result.status,
        result.statusCode,
        result.responseTimeMs,
        result.errorMessage,
      ]
    );

    await client.query('COMMIT');

    return {
      previousStatus,
      saved: insertResult.rows[0],
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const runCheckForMonitor = async (monitor) => {
  const result = await performHealthCheck({
    url: monitor.url,
    method: monitor.method,
  });

  // Lock + re-read previous status at insert time (source of truth for alerts)
  const { previousStatus, saved } = await saveCheckWithPreviousStatus(
    monitor.id,
    result
  );

  const publicResult = CheckHistory.toPublic(saved);

  await setLatestResult(monitor.id, publicResult);
  await maybeSendAlert(monitor, previousStatus, publicResult);

  return {
    monitorId: monitor.id,
    monitorName: monitor.name,
    userId: monitor.user_id,
    previousStatus,
    ...publicResult,
  };
};

const runDueChecks = async () => {
  const dueMonitors = await Monitor.findDueForCheck();

  if (dueMonitors.length === 0) {
    return { checked: 0, results: [] };
  }

  console.log(`Running health checks for ${dueMonitors.length} monitor(s)`);

  const results = [];
  const affectedUsers = new Set();

  for (const monitor of dueMonitors) {
    try {
      const result = await runCheckForMonitor(monitor);
      results.push(result);
      affectedUsers.add(monitor.user_id);

      console.log(
        `  [${result.status.toUpperCase()}] ${monitor.name} — ` +
          `${result.statusCode ?? 'n/a'} — ${result.responseTimeMs}ms`
      );
    } catch (err) {
      console.error(`  [ERROR] ${monitor.name}: ${err.message}`);
    }
  }

  for (const userId of affectedUsers) {
    await invalidateDashboard(userId);
  }

  return { checked: results.length, results };
};

module.exports = {
  runCheckForMonitor,
  runDueChecks,
  shouldSendAlert,
  normalizePreviousStatus,
};
