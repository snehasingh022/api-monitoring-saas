const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');

const DURATION_MULTIPLIERS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

const parseDurationToMs = (duration) => {
  const match = duration.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  return value * DURATION_MULTIPLIERS[unit];
};

const parseDurationToSeconds = (duration) => {
  return Math.floor(parseDurationToMs(duration) / 1000);
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      type: 'access',
    },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

const hashRefreshToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const getRefreshTokenExpiry = () => {
  return new Date(Date.now() + parseDurationToMs(config.jwt.refreshExpiresIn));
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
  parseDurationToSeconds,
};
