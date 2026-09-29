import { generateText } from "../services/ai/cloudflareText.js";

export const generateTitle = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic?.trim()) {
      return res.status(400).json({
        message: "Topic is required",
      });
    }

    const title = await generateText({
      systemPrompt: `
You are an expert technical blog title writer.

Create a clear, engaging and professional title
for a developer blogging platform.

Rules:
- Return only ONE title
- No quotation marks
- No explanation
- Avoid clickbait
- Keep it concise
- Make it technically accurate
      `,

      userPrompt: `
Create a blog title for this topic:

${topic.trim()}
      `,

      maxTokens: 100,
      temperature: 0.8,
    });

    return res.status(200).json({
      message: "Title generated successfully",
      title: title.trim(),
    });
  } catch (error) {
    console.error("AI title generation error:", error);

    return res.status(500).json({
      message: error.message || "Failed to generate title",
    });
  }
};

export const generateTags = async (req, res) => {
  try {
    const { title, content = "" } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const tags = await generateText({
      systemPrompt: `
You are an expert technical blog tag generator.

Generate relevant tags for a developer blogging platform.

Rules:
- Return ONLY a JSON array of strings
- Generate 3 to 6 tags
- Tags must be short and relevant
- Prefer technologies, programming concepts, frameworks, or domains
- Do not include hashtags
- Do not add explanations

Example:
["react", "javascript", "performance", "frontend"]
      `,

      userPrompt: `
Blog title:
${title.trim()}

Blog content:
${content.trim()}
      `,

      maxTokens: 200,
      temperature: 0.3,
    });

    let parsedTags;

    try {
      parsedTags = JSON.parse(tags);
    } catch {
      // Fallback if model adds extra text
      const match = tags.match(/\[[\s\S]*\]/);

      if (!match) {
        throw new Error("AI returned invalid tag format");
      }

      parsedTags = JSON.parse(match[0]);
    }

    if (!Array.isArray(parsedTags)) {
      throw new Error("Invalid tags response");
    }

    const cleanTags = parsedTags
      .filter((tag) => typeof tag === "string" && tag.trim())
      .map((tag) => tag.trim().toLowerCase())
      .slice(0, 6);

    return res.status(200).json({
      message: "Tags generated successfully",
      tags: cleanTags,
    });
  } catch (error) {
    console.error("AI tag generation error:", error);

    return res.status(500).json({
      message: error.message || "Failed to generate tags",
    });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { title, tags = [], topic = "" } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const content = await generateText({
      systemPrompt: `
You are an expert technical blog writer for a developer blogging platform.

Write a high-quality, practical and beginner-friendly technical blog article.

Rules:
- Return ONLY the article content
- Use Markdown
- Do not include the blog title
- Use proper Markdown headings
- Explain concepts clearly
- Include practical examples where useful
- Include code examples when relevant
- Use bullet points or numbered lists when useful
- Avoid unnecessary repetition
- Do not invent citations or references
- Keep the content technically accurate
- Do not add "Here is your article" or any introduction outside the article
      `,

      userPrompt: `
Write a technical blog article based on the following information.

Title:
${title.trim()}

Tags:
${Array.isArray(tags) ? tags.join(", ") : tags}

Additional topic/context:
${topic.trim()}

The article should contain:
1. Introduction
2. Clear explanation of the main concept
3. Practical examples
4. Code examples where appropriate
5. Common mistakes or important considerations
6. Conclusion

Return only Markdown article content.
      `,

      maxTokens: 3000,
      temperature: 0.7,
    });

    return res.status(200).json({
      message: "Content generated successfully",
      content,
    });
  } catch (error) {
    console.error("AI content generation error:", error);

    return res.status(500).json({
      message: error.message || "Failed to generate content",
    });
  }
};

export const generateExcerpt = async (req, res) => {
  try {
    const { title, content = "" } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const excerpt = await generateText({
      systemPrompt: `
You are an expert technical blog editor.

Create a short and professional excerpt for a developer blog.

Rules:
- Return ONLY the excerpt
- No quotation marks
- No Markdown
- No heading
- Maximum 250 characters
- Clearly summarize the article
- Do not use clickbait
- Do not add explanations
      `,

      userPrompt: `
Blog title:
${title.trim()}

Blog content:
${content.trim()}

Write a concise excerpt for this article.
      `,

      maxTokens: 100,
      temperature: 0.5,
    });

    return res.status(200).json({
      message: "Excerpt generated successfully",
      excerpt: excerpt.trim(),
    });
  } catch (error) {
    console.error("AI excerpt generation error:", error);

    return res.status(500).json({
      message: error.message || "Failed to generate excerpt",
    });
  }
};