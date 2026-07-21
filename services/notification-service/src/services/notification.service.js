const { sendEmail } = require('./email.service');
const { buildAlertEmail } = require('../utils/emailTemplates');

const sendStatusAlert = async (payload) => {
  const { to, ...alertData } = payload;
  const { subject, text, html } = buildAlertEmail(alertData);

  const result = await sendEmail({ to, subject, text, html });

  return {
    channel: 'email',
    to,
    subject,
    ...result,
  };
};

module.exports = {
  sendStatusAlert,
};
