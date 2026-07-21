const AppError = require('../utils/AppError');

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return next(new AppError('Authentication required', 401));
  }

  if (!UUID_REGEX.test(userId)) {
    return next(new AppError('Invalid user identity', 401));
  }

  const emailHeader = req.headers['x-user-email'];

  req.user = {
    id: userId,
    email: emailHeader ? String(emailHeader).trim().toLowerCase() : null,
  };

  next();
};

module.exports = authenticate;
