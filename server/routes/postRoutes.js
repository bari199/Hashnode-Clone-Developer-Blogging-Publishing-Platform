import express from "express";

import {
  createPost,
  getPublishedPosts,
  getPostBySlug,
  getMyPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import protect from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/", getPublishedPosts);

router.get("/:slug", getPostBySlug);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.post("/", protect, upload.single("coverImage"), createPost);

router.get("/my/posts", protect, getMyPosts);

router.put("/:id", protect, upload.single("coverImage"), updatePost);

router.delete("/:id", protect, deletePost);

export default router;
