import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import {
  streamNotifications,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";

const router = Router({ mergeParams: true });

router.use(auth);
router.use(workspaceContext);

router.get("/stream", streamNotifications);
router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:notificationId/read", markAsRead);
router.patch("/read-all", markAllAsRead);

export default router;
