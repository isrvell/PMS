import { Resend } from "resend";
import nodemailer from "nodemailer";
import env from "../config/env.js";

const sendEmail = async ({ to, subject, html }) => {
  // Priority 1: Resend API
  if (env.RESEND_API_KEY) {
    console.log(`📧 Sending email to ${to} via Resend API...`);
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: env.RESEND_FROM || "PMS Enterprise <onboarding@resend.dev>",
        to,
        subject,
        html,
      });

      if (error) {
        console.warn(`⚠️  Resend error (non-fatal):`, error.message);
        return { sent: false, reason: error.message };
      }

      console.log(`✅ Email sent to ${to} via Resend — ID: ${data.id}`);
      return { sent: true, id: data.id };
    } catch (err) {
      console.warn(`⚠️  Resend failed (non-fatal):`, err.message);
      return { sent: false, reason: err.message };
    }
  }

  // Priority 2: SMTP (Gmail etc.)
  if (env.SMTP_USER && env.SMTP_PASS) {
    console.log(`📧 Sending email to ${to} via SMTP ${env.SMTP_HOST}...`);
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        secure: Number(env.SMTP_PORT) === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
        connectionTimeout: 10000,
      });

      const info = await transporter.sendMail({
        from: `"PMS Enterprise" <${env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      console.log(`✅ Email sent to ${to} via SMTP — Message ID: ${info.messageId}`);
      return { sent: true, messageId: info.messageId };
    } catch (err) {
      console.warn(`⚠️  SMTP failed (non-fatal):`, err.message);
      return { sent: false, reason: err.message };
    }
  }

  console.warn("⚠️  No email provider configured. Invitation created without email.");
  return { sent: false, reason: "No email provider configured" };
};

export default sendEmail;
