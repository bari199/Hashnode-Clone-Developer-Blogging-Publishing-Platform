import express from "express";

import {
  getAllTags,
  getPostsByTag,
  createTag,
  searchTags,
} from "../controllers/tagController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// --------------------------------------------------------------------------
// Public
// --------------------------------------------------------------------------

router.get("/", getAllTags);

router.get("/search", searchTags);

router.get("/:slug/posts", getPostsByTag);

// --------------------------------------------------------------------------
// Protected
// --------------------------------------------------------------------------

router.post("/", authMiddleware, createTag);

export default router;
