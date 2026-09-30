import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Clock3,
  MessageCircle,
  Sparkles,
  Triangle,
} from "lucide-react";

import api from "../api/axios.js";
import RightSidebar from "../components/layout/RightSidebar.jsx";

// =====================================================
// HELPERS
// =====================================================

const formatTimeAgo = (date) => {
  if (!date) {
    return "";
  }

  const createdDate = new Date(date);
  const now = new Date();

  const difference = Math.max(0, now.getTime() - createdDate.getTime());

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getReadTime = (post) => {
  if (post?.readTime) {
    return post.readTime;
  }

  const contentLength = post?.content?.length || 0;

  return `${Math.max(1, Math.ceil(contentLength / 1000))} min read`;
};

const getAuthorName = (post) => {
  return post?.author?.name || post?.author?.username || "Unknown author";
};

const getAuthorInitial = (post) => {
  return getAuthorName(post)?.charAt(0)?.toUpperCase() || "U";
};

const getPostCommentCount = (post) => {
  return post?.comments?.length ?? post?.commentCount ?? 0;
};

const getPostUpvoteCount = (post) => {
  return post?.upvotes?.length ?? post?.upvoteCount ?? 0;
};

// =====================================================
// POPULAR POST CARD
// =====================================================

const PopularPostCard = ({ post }) => {
  return (
    <article
      className="
        group
        border-b
        border-white/[0.07]
        px-5
        py-5
        transition
        hover:bg-white/[0.025]
      "
    >
      <div className="flex gap-5">
        {/* Image */}

        <Link
          to={`/post/${post?.slug}`}
          className="
            block
            w-[145px]
            shrink-0
            sm:w-[165px]
          "
        >
          {post?.coverImage ? (
            <img
              src={post.coverImage}
              alt={post?.title || "Post cover"}
              className="
                h-[92px]
                w-full
                rounded-lg
                border
                border-white/[0.08]
                object-cover
                transition
                group-hover:opacity-90
              "
            />
          ) : (
            <div
              className="
                flex
                h-[92px]
                w-full
                items-center
                justify-center
                rounded-lg
                border
                border-white/[0.08]
                bg-white/[0.04]
              "
            >
              <Sparkles className="h-6 w-6 text-zinc-600" />
            </div>
          )}
        </Link>

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div
            className="
              mb-2
              flex
              flex-wrap
              items-center
              gap-2
              text-xs
              text-zinc-500
            "
          >
            <span className="truncate text-zinc-400">
              {getAuthorName(post)}
            </span>

            <span>•</span>

            <span>{formatTimeAgo(post?.createdAt)}</span>

            <span>•</span>

            <span>{getReadTime(post)}</span>
          </div>

          <Link to={`/post/${post?.slug}`}>
            <h3
              className="
                line-clamp-2
                text-base
                font-semibold
                leading-6
                text-zinc-100
                transition
                group-hover:text-white
              "
            >
              {post?.title}
            </h3>
          </Link>

          <div
            className="
              mt-3
              flex
              items-center
              gap-4
              text-xs
              text-zinc-600
            "
          >
            <span className="flex items-center gap-1.5">
              <Triangle className="h-3.5 w-3.5" />

              {getPostUpvoteCount(post)}
            </span>

            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />

              {getPostCommentCount(post)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

// =====================================================
// FEED POST
// =====================================================

const FeedPost = ({ post }) => {
  return (
    <article
      className="
        group
        border-b
        border-white/[0.07]
        py-7
      "
    >
      <div className="flex gap-6">
        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="min-w-0 flex-1">
          {/* Author */}

          {/* Author */}

          <div
            className="
    flex
    items-center
    gap-2.5
    text-xs
    text-zinc-500
  "
          >
            {/* Author Avatar */}

            {post?.author?.avatarUrl ? (
              <Link to={`/profile/${post?.author?._id}`} className="shrink-0">
                <img
                  src={post.author.avatarUrl}
                  alt={getAuthorName(post)}
                  className="
          h-7
          w-7
          rounded-full
          border
          border-white/[0.08]
          object-cover
          transition
          hover:opacity-80
        "
                />
              </Link>
            ) : (
              <Link
                to={`/profile/${post?.author?._id}`}
                className="
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-white/[0.08]
        bg-zinc-800
        text-[10px]
        font-semibold
        text-zinc-300
        transition
        hover:bg-zinc-700
      "
              >
                {getAuthorInitial(post)}
              </Link>
            )}

            {/* Author Name */}

            <span className="font-medium text-zinc-400">
              {getAuthorName(post)}
            </span>

            <span>•</span>

            <span>{formatTimeAgo(post?.createdAt)}</span>

            <span>•</span>

            <span>{getReadTime(post)}</span>
          </div>

          {/* Title */}

          <Link to={`/post/${post?.slug}`}>
            <h2
              className="
                mt-3
                line-clamp-2
                text-xl
                font-semibold
                leading-7
                tracking-tight
                text-zinc-100
                transition
                group-hover:text-white
                sm:text-[21px]
              "
            >
              {post?.title}
            </h2>
          </Link>

          {/* Excerpt */}

          {post?.excerpt && (
            <p
              className="
                mt-3
                line-clamp-2
                max-w-3xl
                text-sm
                leading-6
                text-zinc-500
              "
            >
              {post.excerpt}
            </p>
          )}

          {/* Tags */}

          {post?.tags?.length > 0 && (
            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >
              {post.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag?._id || tag?.slug}
                  to={`/tag/${tag?.slug}`}
                  className="
                      rounded-full
                      bg-white/[0.045]
                      px-2.5
                      py-1
                      text-[11px]
                      text-zinc-500
                      transition
                      hover:bg-white/[0.08]
                      hover:text-zinc-300
                    "
                >
                  #{tag?.name}
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}

          <div
            className="
              mt-5
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                flex
                h-8
                items-center
                gap-1.5
                rounded-md
                bg-white/[0.04]
                px-3
                text-xs
                text-zinc-500
              "
            >
              <Triangle className="h-3.5 w-3.5" />

              {getPostUpvoteCount(post)}
            </span>

            <span
              className="
                flex
                h-8
                items-center
                gap-1.5
                rounded-md
                bg-white/[0.04]
                px-3
                text-xs
                text-zinc-500
              "
            >
              <MessageCircle className="h-3.5 w-3.5" />

              {getPostCommentCount(post)}
            </span>

            <button
              type="button"
              className="
                ml-auto
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                text-zinc-600
                transition
                hover:bg-white/[0.05]
                hover:text-zinc-300
              "
              aria-label="Bookmark post"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* =================================================
            COVER IMAGE
        ================================================= */}

        {post?.coverImage && (
          <Link
            to={`/post/${post?.slug}`}
            className="
              hidden
              w-[165px]
              shrink-0
              sm:block
              lg:w-[180px]
            "
          >
            <img
              src={post.coverImage}
              alt={post?.title || "Post cover"}
              className="
                h-[110px]
                w-full
                rounded-xl
                border
                border-white/[0.08]
                object-cover
                transition
                group-hover:opacity-90
              "
            />
          </Link>
        )}
      </div>
    </article>
  );
};

// =====================================================
// FEEDS PAGE
// =====================================================

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // FETCH POSTS
  // ===================================================

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/posts");

      setPosts(Array.isArray(response?.data?.posts) ? response.data.posts : []);
    } catch (error) {
      console.error("Fetch feed error:", error);

      setError(error?.response?.data?.message || "Failed to load feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ===================================================
  // POPULAR POSTS
  // ===================================================

  const popularPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => {
        const aScore =
          (a?.upvotes?.length || a?.upvoteCount || 0) +
          (a?.comments?.length || a?.commentCount || 0);

        const bScore =
          (b?.upvotes?.length || b?.upvoteCount || 0) +
          (b?.comments?.length || b?.commentCount || 0);

        return bScore - aScore;
      })
      .slice(0, 6);
  }, [posts]);

  // ===================================================
  // LATEST POSTS
  // ===================================================

  const feedPosts = useMemo(() => {
    return [...posts].sort(
      (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
    );
  }, [posts]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white">
        <div
          className="
            mx-auto
            grid
            max-w-[1250px]
            grid-cols-1
            xl:grid-cols-[minmax(0,1fr)_300px]
          "
        >
          {/* Main skeleton */}

          <div className="min-w-0 px-5 py-8 sm:px-7">
            <div className="h-7 w-40 animate-pulse rounded bg-white/[0.06]" />

            <div
              className="
                mt-7
                grid
                overflow-hidden
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.04]
                md:grid-cols-2
              "
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="
                      h-[140px]
                      animate-pulse
                      bg-[#0d0f12]
                    "
                />
              ))}
            </div>

            <div className="mt-10 space-y-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="
                      h-[170px]
                      animate-pulse
                      border-b
                      border-white/[0.05]
                      bg-white/[0.015]
                    "
                />
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}

          <div
            className="
              hidden
              border-l
              border-white/[0.06]
              p-5
              xl:block
            "
          >
            <div className="space-y-5">
              <div className="h-48 animate-pulse rounded-xl bg-white/[0.04]" />

              <div className="h-72 animate-pulse rounded-xl bg-white/[0.04]" />

              <div className="h-64 animate-pulse rounded-xl bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <main
        className="
          min-h-screen
          bg-[#08090b]
          px-6
          py-16
          text-white
        "
      >
        <div
          className="
            mx-auto
            max-w-xl
            rounded-xl
            border
            border-red-500/20
            bg-red-500/5
            p-7
            text-center
          "
        >
          <p className="text-sm text-red-300">{error}</p>

          <button
            type="button"
            onClick={fetchPosts}
            className="
              mt-5
              rounded-md
              bg-white
              px-5
              py-2.5
              text-sm
              font-medium
              text-black
              transition
              hover:bg-zinc-200
            "
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <main
      className="
        min-h-screen
        bg-[#08090b]
        text-white
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-[1250px]
          grid-cols-1
          xl:grid-cols-[minmax(0,1fr)_300px]
        "
      >
        {/* =================================================
            MAIN FEED
        ================================================= */}

        <div
          className="
            min-w-0
            px-5
            py-8
            sm:px-7
            lg:px-9
          "
        >
          {/* =================================================
              POPULAR POSTS
          ================================================= */}

          <section>
            <div
              className="
                flex
                items-end
                justify-between
                border-b
                border-white/[0.07]
                pb-4
              "
            >
              <div>
                <h1
                  className="
                    text-xl
                    font-semibold
                    tracking-tight
                    text-white
                    sm:text-2xl
                  "
                >
                  Popular posts
                </h1>

                <p
                  className="
                    mt-1.5
                    text-sm
                    text-zinc-500
                  "
                >
                  Discover what developers are reading right now.
                </p>
              </div>

              <div
                className="
                  hidden
                  items-center
                  gap-2
                  text-xs
                  text-zinc-600
                  sm:flex
                "
              >
                <span>Last 24h</span>

                <span>•</span>

                <span>{posts.length} articles</span>
              </div>
            </div>

            {popularPosts.length > 0 ? (
              <div
                className="
                  mt-1
                  grid
                  overflow-hidden
                  rounded-b-xl
                  border-x
                  border-b
                  border-white/[0.07]
                  md:grid-cols-2
                "
              >
                {popularPosts.map((post) => (
                  <PopularPostCard key={post?._id} post={post} />
                ))}
              </div>
            ) : (
              <div
                className="
                  py-12
                  text-center
                  text-sm
                  text-zinc-600
                "
              >
                No popular posts available.
              </div>
            )}
          </section>

          {/* =================================================
              LATEST COMMUNITY FEED
          ================================================= */}

          <section className="mt-11">
            <div
              className="
                mb-2
                flex
                items-end
                justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-xl
                    font-semibold
                    tracking-tight
                    text-white
                    sm:text-2xl
                  "
                >
                  Latest from the community
                </h2>

                <p
                  className="
                    mt-1.5
                    text-sm
                    text-zinc-500
                  "
                >
                  Fresh articles from developers.
                </p>
              </div>

              <div
                className="
                  hidden
                  items-center
                  gap-1.5
                  text-xs
                  text-zinc-600
                  sm:flex
                "
              >
                <Clock3 className="h-3.5 w-3.5" />
                Latest
              </div>
            </div>

            {feedPosts.length > 0 ? (
              <div>
                {feedPosts.map((post) => (
                  <FeedPost key={post?._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-sm text-zinc-500">No posts found.</p>
              </div>
            )}

            {/* Load More */}

            {feedPosts.length > 0 && (
              <div className="flex justify-center py-10">
                <button
                  type="button"
                  className="
                    rounded-md
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-5
                    py-2.5
                    text-xs
                    font-medium
                    text-zinc-500
                    transition
                    hover:bg-white/[0.06]
                    hover:text-white
                  "
                >
                  Load more
                </button>
              </div>
            )}
          </section>
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <RightSidebar />
      </div>
    </main>
  );
};

export default Feeds;
