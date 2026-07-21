const config = require('../config');

/**
 * Calls Notification Service when a monitor status changes.
 * Failures must never break the check pipeline (caller catches).
 */
const sendStatusChangeAlert = async ({
  to,
  monitorName,
  monitorUrl,
  previousStatus,
  currentStatus,
  statusCode,
  responseTimeMs,
  checkedAt,
  errorMessage,
}) => {
  if (!to) {
    const err = new Error(
      `No alert_email configured for monitor "${monitorName}"`
    );
    err.code = 'NO_ALERT_EMAIL';
    throw err;
  }

  const url = `${config.notification.serviceUrl}/api/notifications/alert`;

  console.log(
    `  [ALERT HTTP] POST ${url} (to=${to}, ${previousStatus} → ${currentStatus})`
  );

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Api-Key': config.notification.internalApiKey,
      },
      body: JSON.stringify({
        to,
        monitorName,
        monitorUrl,
        previousStatus,
        currentStatus,
        statusCode,
        responseTimeMs,
        checkedAt,
        errorMessage,
      }),
    });
  } catch (err) {
    console.error(`  [ALERT HTTP ERROR] Network failure: ${err.message}`);
    throw err;
  }

  const payload = await response.json().catch(() => ({}));

  console.log(
    `  [ALERT HTTP] Response ${response.status}: ${payload.message || 'ok'}`
  );

  if (!response.ok) {
    throw new Error(
      payload.message || `Notification service returned ${response.status}`
    );
  }

  return payload.data?.notification || payload;
};

module.exports = {
  sendStatusChangeAlert,
};
