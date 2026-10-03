import { useEffect, useState } from "react";

import api from "../api/axios.js";

const useTagSearch = (query) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const searchQuery = query?.trim();

    if (!searchQuery) {
      setTags([]);
      setLoading(false);
      setError("");

      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/tags/search", {
          params: {
            q: searchQuery,
          },
        });

        if (ignore) return;

        setTags(response.data?.tags || []);
      } catch (error) {
        if (ignore) return;

        console.error("Tag search error:", error);

        setTags([]);
        setError(error.response?.data?.message || "Failed to search tags.");
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
    tags,
    loading,
    error,
  };
};

export default useTagSearch;
