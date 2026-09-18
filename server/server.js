import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// Models — register before routes
import "./models/User.js";
import "./models/Tag.js";
import "./models/Post.js";

import tagRoutes from "./routes/tagRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Hashnode API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);

const PORT = process.env.PORT || 5000;

// Start server after MongoDB connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
