const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyAccessToken = (token) => {
  const payload = jwt.verify(token, config.jwt.accessSecret);

  if (payload.type !== 'access') {
    throw new Error('Invalid token type');
  }

  return payload;
};

module.exports = {
  verifyAccessToken,
};
