import { useEffect, useState } from "react";
import api from "../api/axios.js";
import TagPill from "../components/post/TagPill.jsx";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags");

        setTags(response.data.tags);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center">Loading tags...</p>
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
      <h1 className="text-4xl font-bold">Tags</h1>

      <p className="mt-2 text-gray-600">
        Explore posts by technology and topic.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tags.map((tag) => (
          <div key={tag._id} className="rounded-lg border p-5">
            <TagPill tag={tag} />

            <p className="mt-3 text-sm text-gray-500">
              {tag.postCount} {tag.postCount === 1 ? "post" : "posts"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Tags;
