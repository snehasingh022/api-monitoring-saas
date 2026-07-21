require('dotenv').config();

const app = require('./app');
const config = require('./config');
const { testConnection } = require('./database/connection');
const { connectRedis } = require('./config/redis');
const { startMonitorWorker, runCheckCycle } = require('./workers/monitor.worker');

const startServer = async () => {
  try {
    await testConnection();
    console.log('Database connected successfully');

    await connectRedis();

    app.listen(config.port, async () => {
      console.log(`Monitor service running on port ${config.port} [${config.env}]`);

      startMonitorWorker();

      try {
        await runCheckCycle('Startup');
      } catch (err) {
        console.error('Startup check cycle failed:', err.message);
      }
    });
  } catch (err) {
    console.error('Failed to start monitor service:', err.message);
    process.exit(1);
  }
};

startServer();
