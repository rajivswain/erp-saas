const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendInvitationEmail = async (to, link) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Invitation to ERP SaaS',
    html: `<p>Click to sign up: <a href="${link}">${link}</a></p>`
  });
  return info;
};
