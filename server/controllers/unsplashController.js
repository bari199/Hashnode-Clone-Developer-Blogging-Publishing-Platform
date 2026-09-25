import {
  searchUnsplashPhotos,
  trackUnsplashDownload,
} from "../utils/unsplash.js";

export const searchPhotos = async (req, res) => {
  try {
    const { query, page = 1, perPage = 12 } = req.query;

    if (!query?.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const data = await searchUnsplashPhotos({
      query: query.trim(),
      page: Number(page),
      perPage: Number(perPage),
    });

    const photos = data.results.map((photo) => ({
      id: photo.id,

      imageUrl: photo.urls.regular,

      thumbnailUrl: photo.urls.small,

      width: photo.width,

      height: photo.height,

      photographer: photo.user.name,

      photographerUsername: photo.user.username,

      photographerUrl: photo.user.links.html,

      unsplashUrl: photo.links.html,

      downloadLocation: photo.links.download_location,
    }));

    return res.status(200).json({
      total: data.total,
      totalPages: data.total_pages,
      photos,
    });
  } catch (error) {
    console.error("Unsplash search error:", error);

    return res.status(500).json({
      message: "Failed to search Unsplash photos",
    });
  }
};

export const trackDownload = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        message: "Download URL is required",
      });
    }

    await trackUnsplashDownload(url);

    return res.status(200).json({
      message: "Unsplash download tracked successfully",
    });
  } catch (error) {
    console.error("Unsplash download tracking error:", error);

    return res.status(500).json({
      message: "Failed to track Unsplash download",
    });
  }
};
