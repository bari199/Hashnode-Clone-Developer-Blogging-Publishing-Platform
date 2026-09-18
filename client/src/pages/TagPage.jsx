import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import PostList from "../components/post/PostList.jsx";

const TagPage = () => {
  const { slug } = useParams();

  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTagPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/tags/${slug}/posts`);

        setPosts(response.data.posts);
        setTag(response.data.tag);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load tag posts");
      } finally {
        setLoading(false);
      }
    };

    fetchTagPosts();
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center">Loading posts...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Back */}
      <Link to="/tags" className="text-sm text-gray-500 hover:text-black">
        ← All Tags
      </Link>

      {/* Heading */}
      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold">#{tag?.name}</h1>

        <p className="mt-2 text-gray-600">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </div>

      {/* Posts */}
      <PostList posts={posts} />
    </main>
  );
};

export default TagPage;
