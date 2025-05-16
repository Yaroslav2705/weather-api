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
   * @param {string} to      — адрес получателя
   * @param {string} subject — тема письма
   * @param {string} text    — plain-text версия
   * @param {string} html    — HTML-версия письма
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

