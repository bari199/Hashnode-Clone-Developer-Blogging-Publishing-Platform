const PostSkeleton = () => {
  return (
    <div className="animate-pulse border-b border-white/[0.06] py-6">
      <div className="flex gap-4">
        <div className="h-20 w-28 rounded-lg bg-white/[0.05]" />

        <div className="flex-1">
          <div className="h-3 w-28 rounded bg-white/[0.05]" />

          <div className="mt-3 h-5 w-3/4 rounded bg-white/[0.05]" />

          <div className="mt-3 h-3 w-full rounded bg-white/[0.04]" />

          <div className="mt-2 h-3 w-2/3 rounded bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
