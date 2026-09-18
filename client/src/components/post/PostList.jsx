import PostCard from "./PostCard.jsx";

const PostList = ({ posts }) => {
  if (posts.length === 0) {
    return <p className="py-10 text-center text-gray-500">No posts found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
