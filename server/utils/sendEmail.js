import nodemailer from "nodemailer";
import env from "../config/env.js";

const sendEmail = async ({ to, subject, html }) => {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn("⚠️  SMTP not configured — SMTP_USER or SMTP_PASS missing. Email NOT sent to:", to);
    console.warn("   Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS environment variables.");
    return { skipped: true, reason: "SMTP not configured" };
  }

  console.log(`📧 Sending email to ${to} via ${env.SMTP_HOST}:${env.SMTP_PORT}...`);

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });

  const info = await transporter.sendMail({
    from: `"PMS Enterprise" <${env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`✅ Email sent to ${to} — Message ID: ${info.messageId}`);
  return info;
};

export default sendEmail;
