// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,
  port:     process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = {
  /**
   * @param {string} to
   * @param {string} subject
   * @param {string} text
   * @param {string} html
   */
  send: (to, subject, text, html) => {
    return transporter.sendMail({
      from:    process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
  }
};

