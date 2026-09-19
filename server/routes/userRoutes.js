import express from "express";

import {
  getUserProfile,
  updateMyProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadmiddleware.js";

const router = express.Router();

// =====================================
// Public
// =====================================

router.get("/:id", getUserProfile);

// =====================================
// Protected
// =====================================

router.put("/me", authMiddleware, upload.single("avatar"), updateMyProfile);

export default router;
