const cron = require('node-cron');
const config = require('../config');
const { runDueChecks } = require('../services/checkRunner.service');

let isRunning = false;

/**
 * Single-flight wrapper — startup and cron share this so two cycles
 * never check the same monitors concurrently (which caused duplicate alerts).
 */
const runCheckCycle = async (label = 'Check') => {
  if (isRunning) {
    console.log(`${label} cycle skipped — another cycle is still running`);
    return { checked: 0, skipped: true };
  }

  isRunning = true;

  try {
    const result = await runDueChecks();

    if (result.checked > 0) {
      console.log(`${label} cycle complete: ${result.checked} monitor(s) checked`);
    }

    return { ...result, skipped: false };
  } catch (err) {
    console.error(`${label} cycle failed:`, err.message);
    throw err;
  } finally {
    isRunning = false;
  }
};

const startMonitorWorker = () => {
  if (!cron.validate(config.worker.cronSchedule)) {
    throw new Error(`Invalid cron schedule: ${config.worker.cronSchedule}`);
  }

  console.log(
    `Monitor worker scheduled: "${config.worker.cronSchedule}" ` +
      `(timeout ${config.worker.checkTimeoutMs}ms)`
  );

  cron.schedule(config.worker.cronSchedule, async () => {
    try {
      await runCheckCycle('Cron');
    } catch {
      // already logged inside runCheckCycle
    }
  });
};

module.exports = {
  startMonitorWorker,
  runCheckCycle,
};
