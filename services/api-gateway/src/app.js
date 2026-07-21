const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRoutes = require('./routes/health.routes');
const { authProxy, monitorProxy } = require('./routes/proxy.routes');
const requestLogger = require('./middlewares/requestLogger');
const { globalRateLimiter, authRateLimiter } = require('./middlewares/rateLimiters');
const authGuard = require('./middlewares/authGuard');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(requestLogger);

app.use('/health', healthRoutes);

// Rate limiting — auth endpoints get stricter limits (brute-force protection)
app.use(authRateLimiter);
app.use(globalRateLimiter);

// Verify JWT on protected routes before proxying
app.use(authGuard);

// Proxy before body parsing so request bodies stream through unchanged
app.use(authProxy);
app.use(monitorProxy);

app.use(express.json());

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;
