const UNSPLASH_API_URL = "https://api.unsplash.com";

export const searchUnsplashPhotos = async ({
  query,
  page = 1,
  perPage = 12,
}) => {
  const url = new URL(`${UNSPLASH_API_URL}/search/photos`);

  url.searchParams.set("query", query);
  url.searchParams.set("page", page);
  url.searchParams.set("per_page", perPage);
  url.searchParams.set("order_by", "relevant");

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData?.errors?.join(", ") || "Failed to fetch photos from Unsplash",
    );
  }

  return response.json();
};

export const trackUnsplashDownload = async (downloadLocation) => {
  const url = new URL(downloadLocation);

  // Security: only allow Unsplash API URLs
  if (url.origin !== UNSPLASH_API_URL) {
    throw new Error("Invalid Unsplash download URL");
  }

  url.searchParams.set("client_id", process.env.UNSPLASH_ACCESS_KEY);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to track Unsplash download");
  }

  return response.json();
};
