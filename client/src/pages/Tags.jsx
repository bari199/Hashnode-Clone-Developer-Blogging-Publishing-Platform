import { useEffect, useState } from "react";
import api from "../api/axios.js";
import TagPill from "../components/post/TagPill.jsx";

const PAGE_BG =
  "min-h-screen w-full bg-white text-gray-900 transition-colors duration-200 dark:bg-[#08090b] dark:text-white";

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
      <div className={PAGE_BG}>
        <main className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center">Loading tags...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={PAGE_BG}>
        <main className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className={PAGE_BG}>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-bold">Tags</h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Explore posts by technology and topic.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tags.map((tag) => (
            <div
              key={tag._id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-5 transition-colors duration-200 dark:border-white/10 dark:bg-[#101014]"
            >
              <TagPill tag={tag} />

              <p className="mt-3 text-sm text-gray-500">
                {tag.postCount} {tag.postCount === 1 ? "post" : "posts"}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tags;
