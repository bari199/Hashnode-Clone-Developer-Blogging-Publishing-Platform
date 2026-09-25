import express from "express";
import {
  searchPhotos,
  trackDownload,
} from "../controllers/unsplashController.js";

const router = express.Router();

router.get("/search", searchPhotos);
router.get("/download", trackDownload);

export default router;
