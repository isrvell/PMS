// SSE (Server-Sent Events) hub for real-time notifications
const clients = new Map(); // userId -> Set<res>

export function addClient(userId, res) {
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(res);

  res.on("close", () => {
    const set = clients.get(userId);
    if (set) {
      set.delete(res);
      if (set.size === 0) clients.delete(userId);
    }
  });
}

export function sendToUser(userId, data) {
  const set = clients.get(userId);
  if (!set) return;
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    try {
      res.write(payload);
    } catch {
      set.delete(res);
    }
  }
}

export function sendToUsers(userIds, data) {
  for (const userId of userIds) {
    sendToUser(userId, data);
  }
}

export default { addClient, sendToUser, sendToUsers };
