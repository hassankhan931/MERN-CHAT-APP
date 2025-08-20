// socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
  });

  // Map of userId -> Set of socketIds (to handle multiple tabs)
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("✅ New socket connected:", socket.id);

    // When user logs in / connects
    socket.on("add-user", (userId) => {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      io.emit("get-users", Array.from(onlineUsers.keys())); // broadcast who is online
    });

    // Send private messages
    socket.on("send-msg", ({ to, message }) => {
      const socketIds = onlineUsers.get(to);
      if (socketIds) {
        socketIds.forEach((sid) => io.to(sid).emit("msg-receive", message));
      }
    });

    // Cleanup when socket disconnects
    socket.on("disconnect", () => {
      for (let [userId, sockets] of onlineUsers.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            onlineUsers.delete(userId); // user fully offline
          }
          break;
        }
      }

      io.emit("get-users", Array.from(onlineUsers.keys())); // update all
      socket.disconnect();
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};
