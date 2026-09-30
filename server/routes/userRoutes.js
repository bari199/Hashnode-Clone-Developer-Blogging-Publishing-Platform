import express from "express";

import {
  getUserProfile,
  updateMyProfile,
  getTrendingAuthors,
  deleteMyAccount,
  searchUsers,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// =====================================
// Public
// =====================================

router.get("/authors/trending", getTrendingAuthors);

router.get("/search", searchUsers);

router.get("/:id", getUserProfile);

// =====================================
// Protected
// =====================================

router.put("/me", authMiddleware, upload.single("avatar"), updateMyProfile);

// Delete Account

router.delete("/me", authMiddleware, deleteMyAccount);

export default router;
