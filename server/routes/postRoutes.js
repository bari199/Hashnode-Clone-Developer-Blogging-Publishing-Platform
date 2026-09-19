import express from "express";
import {
  createPost,
  getPublishedPosts,
  getPostBySlug,
  getMyPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
// Public
router.get("/", getPublishedPosts);

// Protected specific route
router.get("/mine", authMiddleware, getMyPosts);

// Protected create/update
router.post("/", authMiddleware, upload.single("coverImage"), createPost);
router.put("/:id", authMiddleware, upload.single("coverImage"), updatePost);
router.delete("/:id", authMiddleware, deletePost);
// Public dynamic route
router.get("/:slug", getPostBySlug);

export default router;
