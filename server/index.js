import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { sequelize } from "./models/index.js";
import errorHandler from "./middleware/errorHandler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadsDir = join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import teamRoutes from "./routes/team.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import taskLinkRoutes from "./routes/taskLink.routes.js";
import sprintRoutes from "./routes/sprint.routes.js";
import releaseRoutes from "./routes/release.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";
import reportRoutes from "./routes/report.routes.js";
import filterRoutes from "./routes/filter.routes.js";
import slaRoutes from "./routes/sla.routes.js";
import searchRoutes from "./routes/search.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import auth from "./middleware/auth.js";
import { addClient } from "./utils/sseHub.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
app.use(cors({
  origin: isProduction ? true : env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(join(__dirname, "uploads")));

// Serve frontend build in production
app.use(express.static(join(__dirname, "../dist")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// SMTP diagnostic endpoint
app.get("/api/smtp-check", async (req, res) => {
  const config = {
    SMTP_HOST: env.SMTP_HOST || "NOT SET",
    SMTP_PORT: env.SMTP_PORT || "NOT SET",
    SMTP_USER: env.SMTP_USER ? `${env.SMTP_USER.slice(0, 4)}...` : "NOT SET",
    SMTP_PASS: env.SMTP_PASS ? "SET (hidden)" : "NOT SET",
    CLIENT_URL: env.CLIENT_URL || "NOT SET",
  };

  if (!env.SMTP_USER || !env.SMTP_PASS) {
    return res.json({ status: "misconfigured", config, message: "SMTP credentials missing" });
  }

  const nodemailer = (await import("nodemailer")).default;
  const ports = [Number(env.SMTP_PORT), 465];
  const results = [];

  for (const port of ports) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
        connectionTimeout: 10000,
      });
      await transporter.verify();
      results.push({ port, status: "ok" });
    } catch (err) {
      results.push({ port, status: "error", message: err.message });
    }
  }

  const working = results.find((r) => r.status === "ok");
  res.json({
    status: working ? "ok" : "error",
    config,
    workingPort: working?.port || null,
    results,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/workspaces/:workspaceId/projects", projectRoutes);
app.use("/api/workspaces/:workspaceId/tasks", taskRoutes);
app.use("/api/workspaces/:workspaceId/team", teamRoutes);
app.use("/api/workspaces/:workspaceId/invitations", invitationRoutes);
app.use("/api/workspaces/:workspaceId/dashboard", dashboardRoutes);
app.use("/api/workspaces/:workspaceId/tasks", commentRoutes);
app.use("/api/workspaces/:workspaceId/tasks", taskLinkRoutes);
app.use("/api/workspaces/:workspaceId/sprints", sprintRoutes);
app.use("/api/workspaces/:workspaceId/releases", releaseRoutes);
app.use("/api/workspaces/:workspaceId/workflows", workflowRoutes);
app.use("/api/workspaces/:workspaceId/reports", reportRoutes);
app.use("/api/workspaces/:workspaceId/filters", filterRoutes);
app.use("/api/workspaces/:workspaceId/sla", slaRoutes);
app.use("/api/workspaces/:workspaceId/search", searchRoutes);
app.use("/api/workspaces/:workspaceId/notifications", notificationRoutes);
app.use("/api/workspaces/:workspaceId", auth, resourceRoutes);

// Global SSE stream (no workspace context needed)
app.get("/api/notifications/stream", auth, (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write(":ok\n\n");
  addClient(req.user.id, res);
  const keepAlive = setInterval(() => {
    try { res.write(":ping\n\n"); } catch { clearInterval(keepAlive); }
  }, 30000);
  req.on("close", () => clearInterval(keepAlive));
});

app.use(errorHandler);

// SPA fallback — must be after all API routes
app.get("*", (_req, res) => {
  res.sendFile(join(__dirname, "../dist/index.html"));
});

const start = async () => {
  await connectDB();
  await sequelize.sync();
  console.log("Database tables synced");
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

start();
