import express from "express";
import { generateCloudflareImage } from "../services/ai/cloudflareImage.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const prompt =
      "A modern professional blog cover about full stack web development, laptop with code editor, React, Node.js, MongoDB, clean dark futuristic developer workspace, cinematic lighting, wide landscape composition";

    const imageBuffer = await generateCloudflareImage(prompt);

    res.set("Content-Type", "image/png");

    return res.send(imageBuffer);
  } catch (error) {
    console.error("Cloudflare image test error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
