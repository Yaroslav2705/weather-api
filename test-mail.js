require('dotenv').config();
const Mailer = require('./utils/mailer');

(async () => {
  try {
    const to = 'yaroslav.shishmilo27@gmail.com';
    await Mailer.send(
      to,
      'Test Email from Weather API',
      'Это тестовое сообщение SMTP.'
    );
    console.log(`Test email sent to ${to}`);
  } catch (err) {
    console.error('Failed to send test email:', err);
  }
})();

