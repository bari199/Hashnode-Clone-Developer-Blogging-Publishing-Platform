const CLOUDFLARE_API_URL = "https://api.cloudflare.com/client/v4/accounts";

const MODEL = "@cf/zai-org/glm-4.7-flash";

export const generateText = async ({
  systemPrompt,
  userPrompt,
  maxTokens = 1000,
  temperature = 0.7,
}) => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID is missing");
  }

  if (!apiToken) {
    throw new Error("CLOUDFLARE_API_TOKEN is missing");
  }

  const url = `${CLOUDFLARE_API_URL}/${accountId}/ai/run/${MODEL}`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],

      max_tokens: maxTokens,
      temperature,

      // GLM-4.7-Flash reasoning off রাখছি
      chat_template_kwargs: {
        enable_thinking: false,
      },
    }),
  });

  const data = await response.json();

  console.log("Cloudflare AI response:", JSON.stringify(data, null, 2));

  if (!response.ok || !data.success) {
    throw new Error(
      data?.errors?.[0]?.message || "Cloudflare text generation failed",
    );
  }

  // Different response formats handle করা
  const result = data.result;

  const text =
    result?.response ||
    result?.choices?.[0]?.message?.content ||
    result?.choices?.[0]?.text ||
    "";

  if (!text.trim()) {
    throw new Error("Cloudflare returned an empty AI response");
  }

  return text.trim();
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
