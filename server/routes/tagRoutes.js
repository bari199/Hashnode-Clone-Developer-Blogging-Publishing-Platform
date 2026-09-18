import express from "express";

import {
  getAllTags,
  getPostsByTag,
  createTag,
} from "../controllers/tagController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllTags);
router.get("/:slug/posts", getPostsByTag);

// Protected
router.post("/", authMiddleware, createTag);

export default router;
