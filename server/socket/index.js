import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";
import { setSocketIO } from "./socketInstance.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  setSocketIO(io);

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    console.log(`Socket connected: ${socket.id} | User: ${userId}`);

    socket.join(`user:${userId}`);

    socket.on("post:join", (postId) => {
      if (!postId) return;

      socket.join(`post:${postId}`);

      console.log(`User ${userId} joined post:${postId}`);
    });

    socket.on("post:leave", (postId) => {
      if (!postId) return;

      socket.leave(`post:${postId}`);

      console.log(`User ${userId} left post:${postId}`);
    });

    socket.on("tag:join", (tagId) => {
      if (!tagId) return;

      socket.join(`tag:${tagId}`);

      console.log(`User ${userId} joined tag:${tagId}`);
    });

    socket.on("tag:leave", (tagId) => {
      if (!tagId) return;

      socket.leave(`tag:${tagId}`);

      console.log(`User ${userId} left tag:${tagId}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}`);

      console.log(`Reason: ${reason}`);
    });
  });

  return io;
};

export default initializeSocket;
