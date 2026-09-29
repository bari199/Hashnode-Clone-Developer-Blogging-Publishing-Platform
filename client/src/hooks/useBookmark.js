import { useEffect, useState } from "react";

import api from "../api/axios.js";

const useBookmark = (postId) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ==========================================
  // Load Bookmark State
  // ==========================================

  useEffect(() => {
    if (!postId) {
      setBookmarked(false);
      setBookmarkCount(0);
      setFetching(false);
      return;
    }

    const loadBookmarkState = async () => {
      try {
        setFetching(true);

        const response = await api.get(`/interactions/posts/${postId}`);

        setBookmarked(Boolean(response.data?.isBookmarked));

        setBookmarkCount(
          typeof response.data?.bookmarkCount === "number"
            ? response.data.bookmarkCount
            : 0,
        );
      } catch (error) {
        console.error(
          "Failed to load bookmark state:",
          error.response?.data?.message || error.message,
        );
      } finally {
        setFetching(false);
      }
    };

    loadBookmarkState();
  }, [postId]);

  // ==========================================
  // Toggle Bookmark
  // ==========================================

  const toggleBookmark = async () => {
    if (!postId || loading) {
      return;
    }

    try {
      setLoading(true);

      if (bookmarked) {
        const response = await api.delete(
          `/interactions/posts/${postId}/bookmark`,
        );

        const newBookmarkCount =
          typeof response.data?.bookmarkCount === "number"
            ? response.data.bookmarkCount
            : bookmarkCount;

        setBookmarked(false);
        setBookmarkCount(newBookmarkCount);

        // Notify Profile / other components
        window.dispatchEvent(
          new CustomEvent("bookmark:updated", {
            detail: {
              postId,
              bookmarked: false,
              bookmarkCount: newBookmarkCount,
            },
          }),
        );
      } else {
        const response = await api.post(
          `/interactions/posts/${postId}/bookmark`,
        );

        const newBookmarkCount =
          typeof response.data?.bookmarkCount === "number"
            ? response.data.bookmarkCount
            : bookmarkCount;

        setBookmarked(true);
        setBookmarkCount(newBookmarkCount);

        // Notify Profile / other components
        window.dispatchEvent(
          new CustomEvent("bookmark:updated", {
            detail: {
              postId,
              bookmarked: true,
              bookmarkCount: newBookmarkCount,
            },
          }),
        );
      }
    } catch (error) {
      console.error(
        "Bookmark error:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    bookmarked,
    bookmarkCount,
    loading,
    fetching,
    toggleBookmark,
  };
};

export default useBookmark;
