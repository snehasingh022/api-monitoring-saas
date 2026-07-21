require('dotenv').config();

const app = require('./app');
const config = require('./config');
const { connectRedis } = require('./config/redis');

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(config.port, () => {
      console.log(`API Gateway running on port ${config.port} [${config.env}]`);
      console.log(`Auth service proxy target: ${config.services.auth}`);
      console.log(`Monitor service proxy target: ${config.services.monitor}`);
      console.log(
        `Rate limits: ${config.rateLimit.max}/${config.rateLimit.windowMs}ms global, ${config.rateLimit.auth.max}/${config.rateLimit.auth.windowMs}ms auth`
      );
    });
  } catch (err) {
    console.error('Failed to start API Gateway:', err.message);
    process.exit(1);
  }
};

startServer();
