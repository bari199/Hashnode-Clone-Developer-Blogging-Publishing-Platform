import { Link } from "react-router-dom";
import { MessageCircle, Triangle } from "lucide-react";

const PostCard = ({ post }) => {
  const authorName = post?.author?.name || "Unknown author";

  const timeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const created = new Date(date);

    const diffInSeconds = Math.floor((now - created) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 1) {
      return "1d ago";
    }

    return `${diffInDays}d ago`;
  };

  return (
    <article className="group border-b border-white/[0.08] py-4 last:border-b-0">
      <div className="flex gap-3 sm:gap-4">
        {/* Cover Image */}
        <div className="shrink-0">
          {post?.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="
                h-[68px]
                w-[128px]
                rounded-md
                object-cover
                transition
                group-hover:opacity-90
                sm:h-[82px]
                sm:w-[128px]
              "
            />
          ) : (
            <div
              className="
                h-[68px]
                w-[128px]
                rounded-md
                bg-white/[0.06]
                sm:h-[82px]
                sm:w-[128px]
              "
            />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Author + Time + Reading Time */}
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
            <span className="font-medium text-sky-400">{authorName}</span>

            <span>·</span>

            <span>{timeAgo(post?.createdAt)}</span>

            {post?.readingTime && (
              <>
                <span>·</span>

                <span>{post.readingTime} min</span>
              </>
            )}
          </div>

          {/* Title */}
          <Link to={`/post/${post?.slug}`}>
            <h2
              className="
                line-clamp-2
                text-sm
                font-bold
                leading-5
                text-zinc-100
                transition
                group-hover:text-white
                sm:text-base
                sm:leading-6
              "
            >
              {post?.title}
            </h2>
          </Link>

          {/* Stats */}
          <div className="mt-2 flex items-center gap-2">
            {/* Upvote */}
            <button
              type="button"
              className="
                flex
                h-8
                min-w-[58px]
                items-center
                justify-center
                gap-1.5
                rounded-md
                bg-white/[0.07]
                px-2.5
                text-xs
                text-zinc-400
                transition
                hover:bg-white/[0.12]
                hover:text-zinc-200
              "
            >
              <Triangle className="h-3.5 w-3.5" />

              <span>{post?.upvotes?.length ?? post?.upvotes ?? 0}</span>
            </button>

            {/* Comments */}
            <button
              type="button"
              className="
                flex
                h-8
                min-w-[58px]
                items-center
                justify-center
                gap-1.5
                rounded-md
                bg-white/[0.07]
                px-2.5
                text-xs
                text-zinc-400
                transition
                hover:bg-white/[0.12]
                hover:text-zinc-200
              "
            >
              <MessageCircle className="h-3.5 w-3.5" />

              <span>{post?.comments?.length ?? post?.commentCount ?? 0}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
