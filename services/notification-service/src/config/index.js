const requiredEnvVars = [
  'PORT',
  'INTERNAL_API_KEY',
  'SMTP_MODE',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_FROM',
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const smtpMode = process.env.SMTP_MODE.toLowerCase();

if (!['dev', 'smtp'].includes(smtpMode)) {
  throw new Error('SMTP_MODE must be either "dev" or "smtp"');
}

if (smtpMode === 'smtp') {
  const smtpRequired = ['SMTP_USER', 'SMTP_PASSWORD'];
  const smtpMissing = smtpRequired.filter((key) => !process.env[key]);

  if (smtpMissing.length > 0) {
    throw new Error(
      `Missing SMTP credentials for smtp mode: ${smtpMissing.join(', ')}`
    );
  }
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10),
  internalApiKey: process.env.INTERNAL_API_KEY,
  smtp: {
    mode: smtpMode,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM,
  },
};

module.exports = config;
