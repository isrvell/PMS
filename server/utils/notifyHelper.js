import { Notification } from "../models/index.js";
import { sendToUser } from "../utils/sseHub.js";

/**
 * Create a notification and push it in real-time via SSE.
 */
export async function notify({ workspaceId, userId, type, title, message, entityType, entityId }) {
  const notif = await Notification.create({
    workspaceId,
    userId,
    type: type || "general",
    title,
    message: message || "",
    entityType: entityType || null,
    entityId: entityId || null,
  });

  sendToUser(userId, {
    event: "notification",
    data: notif.toJSON(),
  });

  return notif;
}

/**
 * Notify multiple users at once.
 */
export async function notifyMany({ workspaceId, userIds, type, title, message, entityType, entityId }) {
  const results = [];
  for (const userId of userIds) {
    const n = await notify({ workspaceId, userId, type, title, message, entityType, entityId });
    results.push(n);
  }
  return results;
}
