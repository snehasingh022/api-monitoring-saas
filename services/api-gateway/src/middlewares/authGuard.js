const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/token');
const { isPublicAuthRoute } = require('../config/routes');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired', 401));
    }

    return next(new AppError('Invalid or expired access token', 401));
  }
};

const isProtectedApiRoute = (path) => {
  return (
    path.startsWith('/api/auth') ||
    path.startsWith('/api/monitors') ||
    path.startsWith('/api/dashboard')
  );
};

const authGuard = (req, res, next) => {
  if (isPublicAuthRoute(req)) {
    return next();
  }

  if (isProtectedApiRoute(req.path)) {
    return authenticate(req, res, next);
  }

  return next();
};

module.exports = authGuard;
