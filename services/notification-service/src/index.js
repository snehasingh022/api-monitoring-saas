require('dotenv').config();

const app = require('./app');
const config = require('./config');
const { verifyTransport } = require('./services/email.service');

const startServer = async () => {
  try {
    const email = await verifyTransport();
    console.log(`Email transport ready [${email.mode}]`);

    app.listen(config.port, () => {
      console.log(
        `Notification service running on port ${config.port} [${config.env}]`
      );
    });
  } catch (err) {
    console.error('Failed to start notification service:', err.message);
    process.exit(1);
  }
};

startServer();
