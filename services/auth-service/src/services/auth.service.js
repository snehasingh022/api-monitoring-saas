const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const AppError = require('../utils/AppError');
const config = require('../config');
const {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
  parseDurationToSeconds,
} = require('../utils/token');

const SALT_ROUNDS = 12;

const register = async ({ email, password, name }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedName = name.trim();

  const emailTaken = await User.emailExists(normalizedEmail);
  if (emailTaken) {
    throw new AppError('Email already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      name: trimmedName,
    });

    return User.toPublic(user);
  } catch (err) {
    if (err.code === '23505') {
      throw new AppError('Email already registered', 409);
    }
    throw err;
  }
};

const issueTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = getRefreshTokenExpiry();

  await RefreshToken.create({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: parseDurationToSeconds(config.jwt.accessExpiresIn),
    refreshTokenExpiresIn: parseDurationToSeconds(config.jwt.refreshExpiresIn),
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findByEmail(normalizedEmail);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = await issueTokens(user);

  return {
    user: User.toPublic(user),
    tokens,
  };
};

module.exports = {
  register,
  login,
};
