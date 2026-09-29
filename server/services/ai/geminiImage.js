import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateBlogCoverImage = async (prompt) => {
  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-image",

    input: `
Create a professional blog cover image.

Topic:
${prompt}

Requirements:
- Suitable for a developer blogging platform
- Modern and professional
- Clean composition
- No unnecessary text
- Wide landscape composition
- Suitable as a blog cover image
`,

    response_format: {
      type: "image",
      mime_type: "image/jpeg",
      aspect_ratio: "16:9",
      image_size: "1K",
    },
  });

  if (!interaction.output_image?.data) {
    throw new Error("AI image was not generated");
  }

  return Buffer.from(interaction.output_image.data, "base64");
};
