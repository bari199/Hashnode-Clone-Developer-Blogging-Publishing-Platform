import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";

const Dashboard = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/posts/mine");

      setPosts(response.data.posts);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load your posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete post");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center">Loading dashboard...</p>
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
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>

          <p className="mt-2 text-gray-600">Manage your posts.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/profile/${user?._id}`}
            className="rounded-md border px-5 py-3 text-center hover:bg-gray-50"
          >
            View Profile
          </Link>

          <Link
            to="/editor/new"
            className="rounded-md bg-black px-5 py-3 text-center text-white hover:bg-gray-800"
          >
            + New Post
          </Link>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-10 space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-lg border p-10 text-center">
            <p className="text-gray-500">You haven't created any posts yet.</p>

            <Link
              to="/editor/new"
              className="mt-4 inline-block font-medium underline"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="rounded-lg border bg-white p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                {/* Post Information */}
                <div>
                  <h2 className="text-xl font-bold">{post.title}</h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>

                  {/* Status */}
                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {post.status === "published" && (
                    <Link
                      to={`/post/${post.slug}`}
                      className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      View
                    </Link>
                  )}

                  <Link
                    to={`/editor/${post._id}`}
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Dashboard;
