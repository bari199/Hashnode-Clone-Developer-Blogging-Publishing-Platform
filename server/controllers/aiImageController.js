import { generateCloudflareImage } from "../services/ai/cloudflareImage.js";

import { uploadImageBuffer } from "../utils/uploadImageBuffer.js";

export const generateCoverImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        message: "Image prompt is required",
      });
    }

    // Generate image using Cloudflare Workers AI
    const imageBuffer = await generateCloudflareImage(prompt.trim());

    // Upload generated image to Cloudinary
    const uploadResult = await uploadImageBuffer(imageBuffer);

    return res.status(200).json({
      message: "AI cover image generated successfully",

      image: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });
  } catch (error) {
    console.error("AI cover image error:", error);

    return res.status(500).json({
      message: error.message || "Failed to generate AI cover image",
    });
  }
};
