import { Server } from "socket.io";
import env from "../config/env.js";

let io = null;
const onlineUsers = new Map(); // userId -> set of socketIds

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? true : env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);
      io.emit("user_presence", Array.from(onlineUsers.keys()));
    }

    socket.on("join_channel", (channelId) => {
      socket.join(`channel:${channelId}`);
    });

    socket.on("leave_channel", (channelId) => {
      socket.leave(`channel:${channelId}`);
    });

    socket.on("typing", ({ channelId, userId, userName, isTyping }) => {
      socket.to(`channel:${channelId}`).emit("user_typing", { channelId, userId, userName, isTyping });
    });

    socket.on("disconnect", () => {
      if (userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
        io.emit("user_presence", Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export default { initSocket, getIO };
