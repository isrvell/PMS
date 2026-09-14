import { Notification } from "../models/index.js";
import { addClient, sendToUser } from "../utils/sseHub.js";

// SSE stream endpoint
export const streamNotifications = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write(":ok\n\n");

  addClient(req.user.id, res);

  // Keep-alive every 30s
  const keepAlive = setInterval(() => {
    try {
      res.write(":ping\n\n");
    } catch {
      clearInterval(keepAlive);
    }
  }, 30000);

  req.on("close", () => clearInterval(keepAlive));
};

// Get all notifications for current user in workspace
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { workspaceId: req.workspace.id, userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// Get unread count
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.count({
      where: { workspaceId: req.workspace.id, userId: req.user.id, read: false },
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

// Mark a single notification as read
export const markAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { read: true },
      { where: { id: req.params.notificationId, userId: req.user.id } }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { read: true },
      { where: { workspaceId: req.workspace.id, userId: req.user.id, read: false } }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
