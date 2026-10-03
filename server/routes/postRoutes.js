import express from "express";

import {
  createPost,
  getPublishedPosts,
  getPostBySlug,
  getMyPosts,
  updatePost,
  deletePost,
  searchPosts,
} from "../controllers/postController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// =========================================================
// Public Routes
// =========================================================

router.get("/", getPublishedPosts);

router.get("/search", searchPosts);

// =========================================================
// Protected Routes
// =========================================================

router.get("/my/posts", protect, getMyPosts);

router.post("/", protect, upload.single("coverImage"), createPost);

router.put("/:id", protect, upload.single("coverImage"), updatePost);

router.delete("/:id", protect, deletePost);

// IMPORTANT:
// dynamic route must be LAST
router.get("/:slug", getPostBySlug);

export default router;
