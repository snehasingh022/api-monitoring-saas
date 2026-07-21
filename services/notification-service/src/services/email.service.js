const nodemailer = require('nodemailer');
const config = require('../config');

let transporter;

const createTransporter = () => {
  if (config.smtp.mode === 'dev') {
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password,
    },
  });
};

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }

  return transporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: config.smtp.from,
    to,
    subject,
    text,
    html,
  };

  const info = await getTransporter().sendMail(mailOptions);

  if (config.smtp.mode === 'dev') {
    console.log('--- DEV EMAIL (not sent over SMTP) ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log('--------------------------------------');
  }

  return {
    messageId: info.messageId,
    accepted: info.accepted || [to],
    mode: config.smtp.mode,
  };
};

const verifyTransport = async () => {
  if (config.smtp.mode === 'dev') {
    return { mode: 'dev', status: 'ready' };
  }

  await getTransporter().verify();
  return { mode: 'smtp', status: 'ready' };
};

module.exports = {
  sendEmail,
  verifyTransport,
};
