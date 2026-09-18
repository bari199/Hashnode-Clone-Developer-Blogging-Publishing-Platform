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
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-center">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

      {/* Author + Date */}
      <div className="mt-4 flex items-center gap-3 text-gray-600">
        {post.author?.avatarUrl && (
          <img
            src={post.author.avatarUrl}
            alt={post.author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        )}

        <div>
          <p className="font-medium text-gray-900">{post.author?.name}</p>

          <p className="text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="mt-8 max-h-[500px] w-full rounded-lg object-cover"
        />
      )}

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags?.map((tag) => (
          <Link
            key={tag._id}
            to={`/tag/${tag.slug}`}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm"
          >
            #{tag.name}
          </Link>
        ))}
      </div>

      {/* Markdown Content */}
      <article className="prose prose-lg mt-10 max-w-none">
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
                <code className="rounded bg-gray-100 px-1 py-0.5" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </main>
  );
};

export default PostDetail;
