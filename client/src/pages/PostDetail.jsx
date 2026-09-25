import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import api from "../api/axios.js";

const PostDetail = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/posts/${slug}`);

        setPost(response.data.post);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f]">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-center text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0b0f]">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-center text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-gray-200">
      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Card wrapper */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101014]">
          {/* Small heading row */}
          <div className="px-8 pt-10 text-center">
            <h1 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
              {post.title}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Hero banner */}
          <div className="relative mt-8 overflow-hidden">
            {/* Decorative gradient/mesh background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(120,80,255,0.25),transparent_60%),radial-gradient(circle_at_20%_80%,rgba(0,255,180,0.12),transparent_55%)] bg-[#08080b]" />

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
            )}

            <div className="relative flex min-h-[280px] flex-col justify-center gap-4 px-10 py-16 sm:min-h-[360px]">
              <span className="inline-block w-fit rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-fuchsia-300">
                {post.tags?.[0]?.name?.toUpperCase() || "INSIGHTS"}
              </span>

              <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                {post.title}
              </h2>
            </div>
          </div>

          {/* Author row */}
          <div className="flex items-center gap-3 px-8 pt-8">
            {post.author?.avatarUrl && (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
              />
            )}
            <p className="font-medium text-gray-200">{post.author?.name}</p>
          </div>

          {/* Markdown Content */}
          <article className="prose prose-invert prose-lg mt-8 max-w-none px-8 prose-headings:font-bold prose-a:text-fuchsia-400">
            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  if (!inline && match) {
                    return (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }

                  return (
                    <code
                      className="rounded bg-white/10 px-1 py-0.5 text-gray-100"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2 px-8 pb-10">
            {post.tags?.map((tag) => (
              <Link
                key={tag._id}
                to={`/tag/${tag.slug}`}
                className="rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400 hover:bg-white/10 hover:text-white"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Comments section (static shell, no logic added) */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#101014] px-8 py-6">
          <h3 className="text-lg font-semibold text-white">Comments</h3>
          <p className="mt-4 text-center text-sm text-gray-500">
            No comments yet.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
