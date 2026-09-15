import nodemailer from "nodemailer";
import env from "../config/env.js";

const sendEmail = async ({ to, subject, html }) => {
  let transporter;

  if (env.SMTP_USER && env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  const info = await transporter.sendMail({
    from: `"PMS Enterprise" <${env.SMTP_USER || "noreply@pms.com"}>`,
    to,
    subject,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`Email preview: ${previewUrl}`);
  }

  return info;
};

export default sendEmail;
