import { useState, useEffect, useRef, useCallback } from "react";
import Badge from "../../../ui/Badge/Badge";
import Avatar from "../../../ui/Avatar/Avatar.jsx";
import { useWorkspace } from "../../../../context/WorkspaceContext.jsx";
import { useLanguage } from "../../../../context/LanguageContext.jsx";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  connectSSE,
} from "../../../../services/notificationService.js";
import "./Notification.css";

const typeIcons = {
  task_assigned: "bi-person-plus-fill",
  comment_added: "bi-chat-dots-fill",
  task_updated: "bi-pencil-square",
  mention: "bi-at",
  deadline: "bi-alarm-fill",
  sprint: "bi-lightning-fill",
  invitation: "bi-envelope-fill",
  general: "bi-bell-fill",
};

const typeColors = {
  task_assigned: "#3b82f6",
  comment_added: "#22c55e",
  task_updated: "#f59e0b",
  mention: "#8b5cf6",
  deadline: "#ef4444",
  sprint: "#9333ea",
  invitation: "#06b6d4",
  general: "#64748b",
};

function Notification() {
  const { workspaceId } = useWorkspace();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch unread count on mount and periodically
  const fetchUnreadCount = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const { count } = await getUnreadCount(workspaceId);
      setUnreadCount(count);
    } catch {
      /* ignore */
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // SSE real-time connection
  useEffect(() => {
    const disconnect = connectSSE((payload) => {
      if (payload.event === "notification") {
        const notif = payload.data;
        // Only show if it belongs to current workspace
        if (notif.workspaceId === workspaceId) {
          setNotifications((prev) => [notif, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      }
    });
    return disconnect;
  }, [workspaceId]);

  // Fetch full list when dropdown opens
  useEffect(() => {
    if (!open || !workspaceId) return;
    setLoading(true);
    getNotifications(workspaceId)
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, workspaceId]);

  const handleMarkRead = async (notifId) => {
    try {
      await markAsRead(workspaceId, notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(workspaceId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      /* ignore */
    }
  };

  const getRelativeTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="notification-wrapper" ref={ref}>
      <button className="notification" onClick={() => setOpen(!open)}>
        {unreadCount > 0 && <Badge count={unreadCount} />}
        <i className="bi bi-bell"></i>
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h6>{t("notifications")}</h6>
            {unreadCount > 0 && (
              <button
                className="btn btn-link btn-sm text-decoration-none p-0"
                onClick={handleMarkAllRead}
                style={{ fontSize: 12 }}
              >
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="notification-loading">
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <i className="bi bi-bell-slash" style={{ fontSize: 24, opacity: 0.4 }}></i>
                  <p>{t("noNotifications")}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.read ? "unread" : ""}`}
                    onClick={() => !notif.read && handleMarkRead(notif.id)}
                  >
                    <div
                      className="notification-type-icon"
                      style={{ color: typeColors[notif.type] || typeColors.general }}
                    >
                      <i className={`bi ${typeIcons[notif.type] || typeIcons.general}`}></i>
                    </div>
                    <div className="notification-content">
                      <span className="notification-text">{notif.title}</span>
                      {notif.message && (
                        <span className="notification-message">{notif.message}</span>
                      )}
                      <span className="notification-meta">
                        {getRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    {!notif.read && <div className="notification-unread-dot"></div>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notification;
