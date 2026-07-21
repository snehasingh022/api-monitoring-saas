const buildAlertEmail = ({
  monitorName,
  monitorUrl,
  previousStatus,
  currentStatus,
  statusCode,
  responseTimeMs,
  checkedAt,
  errorMessage,
}) => {
  const isDown = currentStatus === 'down';
  const subject = isDown
    ? `[ALERT] ${monitorName} is DOWN`
    : `[RECOVERY] ${monitorName} is back UP`;

  const checkedAtText = checkedAt
    ? new Date(checkedAt).toISOString()
    : new Date().toISOString();

  const text = [
    `Monitor: ${monitorName}`,
    `URL: ${monitorUrl}`,
    `Status: ${previousStatus || 'unknown'} → ${currentStatus}`,
    `Status code: ${statusCode ?? 'n/a'}`,
    `Response time: ${responseTimeMs != null ? `${responseTimeMs}ms` : 'n/a'}`,
    `Checked at: ${checkedAtText}`,
    errorMessage ? `Error: ${errorMessage}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const statusColor = isDown ? '#b91c1c' : '#15803d';

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2 style="color: ${statusColor}; margin-bottom: 8px;">${subject}</h2>
      <p><strong>Monitor:</strong> ${monitorName}</p>
      <p><strong>URL:</strong> <a href="${monitorUrl}">${monitorUrl}</a></p>
      <p><strong>Status:</strong> ${previousStatus || 'unknown'} → <strong>${currentStatus}</strong></p>
      <p><strong>Status code:</strong> ${statusCode ?? 'n/a'}</p>
      <p><strong>Response time:</strong> ${responseTimeMs != null ? `${responseTimeMs}ms` : 'n/a'}</p>
      <p><strong>Checked at:</strong> ${checkedAtText}</p>
      ${errorMessage ? `<p><strong>Error:</strong> ${errorMessage}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
      <p style="font-size: 12px; color: #666;">Sent by API Monitoring SaaS</p>
    </div>
  `;

  return { subject, text, html };
};

module.exports = {
  buildAlertEmail,
};
