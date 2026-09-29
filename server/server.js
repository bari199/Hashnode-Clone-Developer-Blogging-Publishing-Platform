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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hashnode API is running",
  });
});

// Existing routes
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

const PORT = process.env.PORT || 5000;

connectDB();

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
