import { useEffect, useState } from "react";

import api from "../api/axios.js";

const useUserSearch = (query) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const searchQuery = query?.trim();

    if (!searchQuery) {
      setUsers([]);
      setLoading(false);
      setError("");

      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/search", {
          params: {
            q: searchQuery,
          },
        });

        if (ignore) return;

        setUsers(response.data?.users || []);
      } catch (error) {
        if (ignore) return;

        console.error("User search error:", error);

        setUsers([]);

        setError(error.response?.data?.message || "Failed to search users.");
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
    users,
    loading,
    error,
  };
};

export default useUserSearch;
