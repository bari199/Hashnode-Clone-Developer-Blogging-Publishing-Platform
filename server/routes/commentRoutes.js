import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createComment,
  getPostComments,
  getUserComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Get all comments of a post
router.get("/posts/:postId", authMiddleware, getPostComments);
// Get User Comments
router.get("/users/:userId", authMiddleware, getUserComments);

// Create comment / reply
router.post("/posts/:postId", authMiddleware, createComment);

// Update comment
router.patch("/:commentId", authMiddleware, updateComment);

// Delete comment
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
