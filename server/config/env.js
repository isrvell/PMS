import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../.env") });

const env = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@pms.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
  ADMIN_NAME: process.env.ADMIN_NAME || "Admin",
};

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export default env;
