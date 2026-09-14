import apiFetch from "./api.js";

const API_BASE = "/api";

export const getNotifications = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/notifications`);

export const getUnreadCount = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/notifications/unread-count`);

export const markAsRead = (workspaceId, notificationId) =>
  apiFetch(`/workspaces/${workspaceId}/notifications/${notificationId}/read`, {
    method: "PATCH",
  });

export const markAllAsRead = (workspaceId) =>
  apiFetch(`/workspaces/${workspaceId}/notifications/read-all`, {
    method: "PATCH",
  });

/**
 * Creates an SSE (Server-Sent Events) connection for real-time notifications.
 * Returns an EventSource instance. Caller must close it on unmount.
 */
export function createNotificationStream() {
  const token = localStorage.getItem("token");
  // EventSource doesn't support custom headers, so we pass token as query param
  // We'll use a fetch-based approach instead
  return null; // placeholder — we use the hook below
}

/**
 * SSE hook helper — uses fetch with ReadableStream for auth support
 */
export function connectSSE(onMessage) {
  const token = localStorage.getItem("token");
  const controller = new AbortController();

  fetch(`${API_BASE}/notifications/stream`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  })
    .then((res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      function read() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) return;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  onMessage(data);
                } catch {
                  // ignore parse errors (keepalive, etc.)
                }
              }
            }
            read();
          })
          .catch(() => {}); // aborted
      }

      read();
    })
    .catch(() => {}); // connection error

  return () => controller.abort();
}
