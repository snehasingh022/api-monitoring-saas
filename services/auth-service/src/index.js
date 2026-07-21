require('dotenv').config();

const app = require('./app');
const config = require('./config');
const { testConnection } = require('./database/connection');

const startServer = async () => {
  try {
    await testConnection();
    console.log('Database connected successfully');

    app.listen(config.port, () => {
      console.log(`Auth service running on port ${config.port} [${config.env}]`);
    });
  } catch (err) {
    console.error('Failed to start auth service:', err.message);
    process.exit(1);
  }
};

startServer();
