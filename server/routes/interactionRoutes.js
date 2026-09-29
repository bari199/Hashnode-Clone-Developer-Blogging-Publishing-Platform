import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  likePost,
  unlikePost,
  upvotePost,
  removeUpvote,
  bookmarkPost,
  removeBookmark,
  getPostInteractions,
  getUserBookmarkCount,
  getUserBookmarks,
} from "../controllers/interactionController.js";

const router = express.Router();

// Post interactions
router.post("/posts/:postId/like", authMiddleware, likePost);

router.delete("/posts/:postId/like", authMiddleware, unlikePost);

router.post("/posts/:postId/upvote", authMiddleware, upvotePost);

router.delete("/posts/:postId/upvote", authMiddleware, removeUpvote);

// Get total bookmark count of a user
router.get(
  "/users/:userId/bookmarks/count",
  authMiddleware,
  getUserBookmarkCount,
);

router.get("/users/:userId/bookmarks", authMiddleware, getUserBookmarks);

router.post("/posts/:postId/bookmark", authMiddleware, bookmarkPost);

router.delete("/posts/:postId/bookmark", authMiddleware, removeBookmark);

// Get interaction state
router.get("/posts/:postId", authMiddleware, getPostInteractions);

export default router;
