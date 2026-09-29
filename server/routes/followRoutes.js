import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  followUser,
  unfollowUser,
  getUserFollowStatus,
  getFollowers,
  getFollowing,
  followTag,
  unfollowTag,
  getTagFollowStatus,
  getUserFollowedTags,
} from "../controllers/followController.js";

const router = express.Router();

// ======================================================
// USER FOLLOW
// ======================================================

// Follow user
router.post("/users/:userId", authMiddleware, followUser);

// Unfollow user
router.delete("/users/:userId", authMiddleware, unfollowUser);

// Get user follow status
router.get("/users/:userId/status", authMiddleware, getUserFollowStatus);

// Get followers
router.get("/users/:userId/followers", authMiddleware, getFollowers);

// Get following
router.get("/users/:userId/following", authMiddleware, getFollowing);

// ======================================================
// TAG FOLLOW
// ======================================================

router.get("/users/:userId/tags", authMiddleware, getUserFollowedTags);

// Follow tag
router.post("/tags/:tagId", authMiddleware, followTag);

// Unfollow tag
router.delete("/tags/:tagId", authMiddleware, unfollowTag);

// Get tag follow status
router.get("/tags/:tagId/status", authMiddleware, getTagFollowStatus);

export default router;
