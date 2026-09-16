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
import { createServer } from "http";
import resourceRoutes from "./routes/resource.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import auth from "./middleware/auth.js";
import { addClient } from "./utils/sseHub.js";
import { initSocket } from "./utils/socketHub.js";

const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);
app.set("io", io);

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

// SMTP/Resend diagnostic endpoint
app.get("/api/smtp-check", async (req, res) => {
  const config = {
    RESEND_API_KEY: env.RESEND_API_KEY ? "SET (hidden)" : "NOT SET",
    SMTP_HOST: env.SMTP_HOST || "NOT SET",
    SMTP_PORT: env.SMTP_PORT || "NOT SET",
    SMTP_USER: env.SMTP_USER ? `${env.SMTP_USER.slice(0, 4)}...` : "NOT SET",
    CLIENT_URL: env.CLIENT_URL || "NOT SET",
  };

  if (env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(env.RESEND_API_KEY);
      // Quick API check
      await resend.domains.list();
      return res.json({ status: "ok", provider: "resend", config });
    } catch (err) {
      return res.json({ status: "error", provider: "resend", config, message: err.message });
    }
  }

  res.json({ status: "misconfigured", config, message: "No email provider configured" });
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
app.use("/api/workspaces/:workspaceId/chat", chatRoutes);
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
  httpServer.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

start();
