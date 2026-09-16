import { Resend } from "resend";
import nodemailer from "nodemailer";
import env from "../config/env.js";

const sendEmail = async ({ to, subject, html }) => {
  // Priority 1: Resend API (works on all hosting platforms)
  if (env.RESEND_API_KEY) {
    console.log(`📧 Sending email to ${to} via Resend API...`);
    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM || "PMS Enterprise <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`❌ Resend error:`, error);
      throw new Error(error.message);
    }

    console.log(`✅ Email sent to ${to} via Resend — ID: ${data.id}`);
    return data;
  }

  // Priority 2: SMTP (Gmail etc.)
  if (env.SMTP_USER && env.SMTP_PASS) {
    console.log(`📧 Sending email to ${to} via SMTP ${env.SMTP_HOST}...`);
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
    return info;
  }

  console.warn("⚠️  No email provider configured. Set RESEND_API_KEY or SMTP_USER/SMTP_PASS.");
  return { skipped: true, reason: "No email provider configured" };
};

export default sendEmail;
