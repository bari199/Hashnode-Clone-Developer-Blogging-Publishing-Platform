const CLOUDFLARE_API_URL = "https://api.cloudflare.com/client/v4/accounts";

const MODEL = "@cf/stabilityai/stable-diffusion-xl-base-1.0";

export const generateCloudflareImage = async (prompt) => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID is missing");
  }

  if (!apiToken) {
    throw new Error("CLOUDFLARE_API_TOKEN is missing");
  }

  const url = `${CLOUDFLARE_API_URL}/` + `${accountId}/ai/run/${MODEL}`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      prompt,

      negative_prompt: "text, letters, watermark, logo, blurry, low quality",

      width: 1024,
      height: 576,

      num_steps: 20,

      guidance: 7.5,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Cloudflare AI error ${response.status}: ${errorText}`);
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());

  return imageBuffer;
};
