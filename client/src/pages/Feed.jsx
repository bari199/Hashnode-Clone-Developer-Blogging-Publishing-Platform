import { useEffect, useState } from "react";
import api from "../api/axios.js";
import PostList from "../components/post/PostList.jsx";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/posts", {
        params: {
          search: search || undefined,
        },
      });

      setPosts(response.data.posts);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchPosts();
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Latest Posts</h1>

        <p className="mt-2 text-gray-600">
          Discover articles from the developer community.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-3">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="flex-1 rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          className="rounded-md bg-black px-6 py-3 text-white"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && <p className="py-10 text-center">Loading posts...</p>}

      {/* Error */}
      {!loading && error && (
        <p className="py-10 text-center text-red-500">{error}</p>
      )}

      {/* Posts */}
      {!loading && !error && <PostList posts={posts} />}
    </main>
  );
};

export default Feed;
