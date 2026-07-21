const config = require('../config');

/**
 * Performs a single HTTP health check against a target URL.
 * Uses AbortController for timeout — never hangs indefinitely.
 */
const performHealthCheck = async ({ url, method = 'GET' }) => {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    config.worker.checkTimeoutMs
  );

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'API-Tracker-Monitor/1.0',
        Accept: '*/*',
      },
    });

    const responseTimeMs = Date.now() - start;
    const statusCode = response.status;
    const isUp = statusCode >= 200 && statusCode < 400;

    // Drain body so connections can be reused / closed cleanly
    await response.arrayBuffer().catch(() => {});

    return {
      status: isUp ? 'up' : 'down',
      statusCode,
      responseTimeMs,
      errorMessage: isUp ? null : `Unexpected status code: ${statusCode}`,
    };
  } catch (err) {
    const responseTimeMs = Date.now() - start;
    const isTimeout = err.name === 'AbortError';

    return {
      status: 'down',
      statusCode: null,
      responseTimeMs,
      errorMessage: isTimeout
        ? `Request timed out after ${config.worker.checkTimeoutMs}ms`
        : err.message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

module.exports = {
  performHealthCheck,
};
