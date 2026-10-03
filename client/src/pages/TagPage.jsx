import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useTagFollow from "../hooks/useTagFollow.js";
import api from "../api/axios.js";
import RightSidebar from "../components/layout/RightSidebar.jsx";

const TagPage = () => {
  const { slug } = useParams();

  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    following,
    followerCount,
    loading: followLoading,
    submitting: followSubmitting,
    toggleFollow,
  } = useTagFollow(tag?._id);

  useEffect(() => {
    const fetchTagPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/tags/${slug}/posts`);

        setPosts(response?.data?.posts || []);
        setTag(response?.data?.tag || null);
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load tag posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchTagPosts();
  }, [slug]);

  // ========================= FORMAT DATE ==========================

  const formatDate = (date) => {
    if (!date) return "";

    const createdDate = new Date(date);
    const now = new Date();

    const diffInHours = Math.floor((now - createdDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    }

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    return createdDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // ========================= READ TIME ==========================

  const getReadTime = (post) => {
    if (post?.readTime) {
      return post.readTime;
    }

    const contentLength = post?.content?.length || 0;

    return Math.max(1, Math.ceil(contentLength / 1000));
  };

  // ========================= AUTHOR NAME ==========================

  const getAuthorName = (post) => {
    return post?.author?.name || post?.author?.username || "Unknown author";
  };

  // ========================= AUTHOR INITIAL ==========================

  const getAuthorInitial = (post) => {
    return getAuthorName(post).charAt(0).toUpperCase();
  };

  // ========================= LOADING ==========================

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#08090b] text-gray-900 dark:text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black/20 dark:border-white/20 border-t-gray-900 dark:border-t-white" />

            <p className="text-sm text-zinc-500">Loading tag feed...</p>
          </div>
        </div>
      </main>
    );
  }

  // ========================= ERROR ==========================

  if (error) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#08090b] px-4 py-10 text-gray-900 dark:text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        </div>
      </main>
    );
  }

  const tagName = tag?.name || slug;

  return (
    <main className="min-h-screen bg-white dark:bg-[#08090b] text-gray-900 dark:text-white">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px]">
          {/* =================================================
              CENTER FEED
          ================================================= */}

          <section
            className="
              min-w-0
              px-5
              py-5
              sm:px-8
              lg:border-r
              lg:border-black/[0.05] dark:lg:border-white/[0.05]
              lg:px-6
            "
          >
            {/* ========================= PAGE HEADER ========================== */}

            <div className="border-b border-black/[0.07] dark:border-white/[0.07] pb-5">
              <div className="flex items-center justify-between gap-5">
                {/* Tag Information */}

                <div className="min-w-0">
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    #{tagName}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span>
                      {tag?.postCount ?? posts.length}{" "}
                      {tag?.postCount === 1 || posts.length === 1
                        ? "post"
                        : "posts"}
                    </span>

                    <span>·</span>

                    <span>
                      {followerCount ??
                        tag?.followersCount ??
                        tag?.followers ??
                        0}{" "}
                      {(followerCount ??
                        tag?.followersCount ??
                        tag?.followers ??
                        0) === 1
                        ? "follower"
                        : "followers"}
                    </span>
                  </div>
                </div>

                {/* ========================= FOLLOW BUTTON ========================== */}

                <button
                  type="button"
                  onClick={toggleFollow}
                  disabled={followLoading || followSubmitting}
                  className={`shrink-0 rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                    following
                      ? "border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-gray-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      : "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {followSubmitting
                    ? "Please wait..."
                    : following
                      ? "Following"
                      : "+ Follow"}
                </button>
              </div>
            </div>

            {/* ========================= ARTICLES LABEL ========================== */}

            <div className="border-b border-black/[0.07] dark:border-white/[0.07] py-4">
              <span className="rounded-md bg-black/[0.08] dark:bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-white">
                Articles
              </span>
            </div>

            {/* ========================= POSTS ========================== */}

            {posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-zinc-500">
                  No posts found for #{tagName}.
                </p>
              </div>
            ) : (
              <div>
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="border-b border-black/[0.07] dark:border-white/[0.07] py-5"
                  >
                    <div className="flex gap-4">
                      {/* ========================= ARTICLE CONTENT ========================== */}

                      <div className="min-w-0 flex-1">
                        {/* ========================= AUTHOR META ========================== */}

                        <div className="flex items-center gap-2.5 text-[10px] text-zinc-500">
                          {/* Author Avatar */}

                          <Link
                            to={`/profile/${post?.author?._id}`}
                            className="shrink-0"
                            aria-label={`View ${getAuthorName(post)} profile`}
                          >
                            {post?.author?.avatarUrl ? (
                              <img
                                src={post.author.avatarUrl}
                                alt={getAuthorName(post)}
                                className="
                                  h-7
                                  w-7
                                  rounded-full
                                  border
                                  border-black/[0.08] dark:border-white/[0.08]
                                  object-cover
                                  transition
                                  hover:opacity-80
                                "
                              />
                            ) : (
                              <div
                                className="
                                  flex
                                  h-7
                                  w-7
                                  items-center
                                  justify-center
                                  rounded-full
                                  border
                                  border-black/[0.08] dark:border-white/[0.08]
                                  bg-zinc-200 dark:bg-zinc-800
                                  text-[10px]
                                  font-semibold
                                  text-zinc-700 dark:text-zinc-300
                                  transition
                                  hover:bg-zinc-300 dark:hover:bg-zinc-700
                                "
                              >
                                {getAuthorInitial(post)}
                              </div>
                            )}
                          </Link>

                          {/* Author Info */}

                          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                            <Link
                              to={`/profile/${post?.author?._id}`}
                              className="font-medium text-zinc-700 dark:text-zinc-300 transition hover:text-gray-900 dark:hover:text-white"
                            >
                              {getAuthorName(post)}
                            </Link>

                            {post?.author?.username && (
                              <>
                                <span>in</span>

                                <span className="text-zinc-500">
                                  {post.author.username}
                                </span>
                              </>
                            )}

                            <span>·</span>

                            <span>{formatDate(post.createdAt)}</span>

                            <span>·</span>

                            <span>{getReadTime(post)} min read</span>
                          </div>
                        </div>

                        {/* ========================= TITLE ========================== */}

                        <Link to={`/post/${post.slug}`} className="mt-2 block">
                          <h2
                            className="
                              text-sm
                              font-bold
                              leading-5
                              text-gray-900 dark:text-white
                              transition
                              hover:text-zinc-700 dark:hover:text-zinc-300
                              sm:text-base
                            "
                          >
                            {post.title}
                          </h2>
                        </Link>

                        {/* ========================= EXCERPT ========================== */}

                        <p
                          className="
                            mt-1.5
                            line-clamp-2
                            text-[11px]
                            leading-4
                            text-zinc-500
                            sm:text-xs
                          "
                        >
                          {post.excerpt ||
                            post.description ||
                            post.content
                              ?.replace(/[#*_>`]/g, "")
                              .slice(0, 180) ||
                            "Read this article to learn more about the topic..."}
                          ...
                        </p>

                        {/* ========================= BOTTOM ACTIONS ========================== */}

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-[10px] text-zinc-600">
                            <span>
                              ♧ {post.reactionsCount ?? post.likesCount ?? 0}
                            </span>

                            <span>◯ {post.commentsCount ?? 0}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Small Author Avatar */}

                            <Link
                              to={`/profile/${post?.author?._id}`}
                              className="shrink-0"
                            >
                              {post?.author?.avatarUrl ? (
                                <img
                                  src={post.author.avatarUrl}
                                  alt={getAuthorName(post)}
                                  className="
                                    h-5
                                    w-5
                                    rounded-full
                                    border
                                    border-black/[0.08] dark:border-white/[0.08]
                                    object-cover
                                    transition
                                    hover:opacity-80
                                  "
                                />
                              ) : (
                                <div
                                  className="
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-zinc-200 dark:bg-zinc-800
                                    text-[7px]
                                    font-semibold
                                    text-zinc-500 dark:text-zinc-400
                                  "
                                >
                                  {getAuthorInitial(post)}
                                </div>
                              )}
                            </Link>

                            <button
                              type="button"
                              className="text-zinc-600 transition hover:text-zinc-700 dark:hover:text-zinc-300"
                              aria-label="Bookmark"
                            >
                              ♧
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ========================= COVER IMAGE ========================== */}

                      {post.coverImage && (
                        <Link
                          to={`/post/${post.slug}`}
                          className="hidden w-[120px] shrink-0 sm:block"
                        >
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="
                              h-[78px]
                              w-[120px]
                              rounded-lg
                              border
                              border-black/[0.08] dark:border-white/[0.08]
                              object-cover
                            "
                          />
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* ========================= LOAD MORE ========================== */}

            {posts.length > 0 && (
              <div className="py-8 text-center">
                <button
                  type="button"
                  className="
                    text-xs
                    font-medium
                    text-zinc-500
                    transition
                    hover:text-gray-900 dark:hover:text-white
                  "
                >
                  Load more ↓
                </button>
              </div>
            )}
          </section>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <RightSidebar />
        </div>
      </div>
    </main>
  );
};

export default TagPage;
