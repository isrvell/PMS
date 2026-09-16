import nodemailer from "nodemailer";
import env from "../config/env.js";

const sendEmail = async ({ to, subject, html }) => {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn("⚠️  SMTP not configured — SMTP_USER or SMTP_PASS missing. Email NOT sent to:", to);
    return { skipped: true, reason: "SMTP not configured" };
  }

  console.log(`📧 Sending email to ${to} via ${env.SMTP_HOST}:${env.SMTP_PORT}...`);

  // Try primary port first, fallback to 465 SSL if timeout
  const ports = [Number(env.SMTP_PORT), 465];
  let lastError;

  for (const port of ports) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
        connectionTimeout: 10000,
      });

      const info = await transporter.sendMail({
        from: `"PMS Enterprise" <${env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      console.log(`✅ Email sent to ${to} via port ${port} — Message ID: ${info.messageId}`);
      return info;
    } catch (err) {
      console.warn(`⚠️  Port ${port} failed: ${err.message}`);
      lastError = err;
    }
  }

  console.error(`❌ All SMTP ports failed for ${to}:`, lastError.message);
  throw lastError;
};

export default sendEmail;
