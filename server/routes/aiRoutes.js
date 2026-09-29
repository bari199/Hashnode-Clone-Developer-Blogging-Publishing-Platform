import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { generateCoverImage } from "../controllers/aiImageController.js";

import {
  generateTitle,
  generateTags,
  generateContent,
  generateExcerpt,
} from "../controllers/aiTextController.js";

const router = express.Router();

router.post("/generate-cover", authMiddleware, generateCoverImage);
router.post("/generate-tags", authMiddleware, generateTags);
router.post("/generate-content", authMiddleware, generateContent);
router.post("/generate-excerpt", authMiddleware, generateExcerpt);
router.post("/generate-title", authMiddleware, generateTitle);

export default router;
