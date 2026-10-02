import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import unsplashRoutes from "./routes/unsplashRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import cloudflareTestRoutes from "./routes/cloudflareTestRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import followRoutes from "./routes/followRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";
import initializeSocket from "./socket/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hashnode-clone-developer-blogging-p-snowy.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hashnode API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);
app.use("/api/unsplash", unsplashRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cloudflare", cloudflareTestRoutes);

// Social routes
app.use("/api/notifications", notificationRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follows", followRoutes);

// Error middleware
app.use(errorMiddleware);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO on the same HTTP server
const io = initializeSocket(server);

app.set("io", io);

const PORT = process.env.PORT || 5000;

// Connect database and start server
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Socket.IO server initialized");
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
