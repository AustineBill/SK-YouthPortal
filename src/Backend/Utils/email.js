// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email using Nodemailer transporter
 * @param {Object} mailOptions - { to, subject, text, html }
 * @returns {Promise}
 */
async function sendEmail(mailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      ...mailOptions,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendEmail };
