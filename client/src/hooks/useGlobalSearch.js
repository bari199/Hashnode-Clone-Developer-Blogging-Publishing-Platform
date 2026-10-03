import { useEffect, useState } from "react";

import api from "../api/axios.js";

const useGlobalSearch = (query, activeTab = "all") => {
  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const searchQuery = query?.trim();

    // Empty query
    if (!searchQuery) {
      setPeople([]);
      setPosts([]);
      setTags([]);

      setLoading(false);
      setError("");

      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        setError("");

        // =====================================================
        // PEOPLE
        // =====================================================

        const searchPeople = async () => {
          const response = await api.get("/users/search", {
            params: {
              q: searchQuery,
            },
          });

          return response.data?.users || [];
        };

        // =====================================================
        // POSTS
        // =====================================================

        const searchPosts = async () => {
          const response = await api.get("/posts/search", {
            params: {
              q: searchQuery,
            },
          });

          return response.data?.posts || [];
        };

        // =====================================================
        // TAGS
        // =====================================================

        const searchTags = async () => {
          const response = await api.get("/tags/search", {
            params: {
              q: searchQuery,
            },
          });

          return response.data?.tags || [];
        };

        // =====================================================
        // ALL
        // =====================================================

        if (activeTab === "all") {
          const [peopleResults, postResults, tagResults] = await Promise.all([
            searchPeople(),
            searchPosts(),
            searchTags(),
          ]);

          if (ignore) return;

          setPeople(peopleResults);
          setPosts(postResults);
          setTags(tagResults);

          return;
        }

        // =====================================================
        // PEOPLE ONLY
        // =====================================================

        if (activeTab === "people") {
          const peopleResults = await searchPeople();

          if (ignore) return;

          setPeople(peopleResults);
          setPosts([]);
          setTags([]);

          return;
        }

        // =====================================================
        // POSTS ONLY
        // =====================================================

        if (activeTab === "posts") {
          const postResults = await searchPosts();

          if (ignore) return;

          setPeople([]);
          setPosts(postResults);
          setTags([]);

          return;
        }

        // =====================================================
        // TAGS ONLY
        // =====================================================

        if (activeTab === "tags") {
          const tagResults = await searchTags();

          if (ignore) return;

          setPeople([]);
          setPosts([]);
          setTags(tagResults);
        }
      } catch (error) {
        if (ignore) return;

        console.error("Global search error:", error);

        setPeople([]);
        setPosts([]);
        setTags([]);

        setError(error.response?.data?.message || "Failed to search.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      search();
    }, 350);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query, activeTab]);

  return {
    people,
    posts,
    tags,

    loading,
    error,
  };
};

export default useGlobalSearch;
