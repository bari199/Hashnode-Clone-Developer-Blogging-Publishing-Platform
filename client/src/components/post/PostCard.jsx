import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <article className="overflow-hidden rounded-lg border bg-white">
      {/* Cover Image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-52 w-full object-cover"
        />
      )}

      <div className="p-5">
        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className="text-xl font-bold hover:underline">{post.title}</h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && <p className="mt-2 text-gray-600">{post.excerpt}</p>}

        {/* Author + Date */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{post.author?.name}</span>

          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Link
              key={tag._id}
              to={`/tag/${tag.slug}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
