import { useEffect, useState } from "react";

import api from "../api/axios.js";

const usePostSearch = (query) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const searchQuery = query?.trim();

    if (!searchQuery) {
      setPosts([]);
      setLoading(false);
      setError("");

      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/posts/search", {
          params: {
            q: searchQuery,
          },
        });

        if (ignore) return;

        setPosts(response.data?.posts || []);
      } catch (error) {
        if (ignore) return;

        console.error("Post search error:", error);

        setPosts([]);
        setError(error.response?.data?.message || "Failed to search posts.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  return {
    posts,
    loading,
    error,
  };
};

export default usePostSearch;
