import { Hash, X } from "lucide-react";
import { Link } from "react-router-dom";

const FollowedTagsModal = ({ tags, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#101014] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Followed Tags
            </h2>

            <p className="mt-1 text-xs text-gray-500">Tags this user follows</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[420px] overflow-y-auto p-4">
          {tags.length === 0 ? (
            <div className="py-10 text-center">
              <Hash className="mx-auto h-8 w-8 text-gray-600" />

              <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                No followed tags
              </p>

              <p className="mt-1 text-xs text-gray-600">
                This user isn't following any tags yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <Link
                  key={tag._id}
                  to={`/tag/${tag.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.03] px-4 py-3 transition hover:border-black/10 dark:hover:border-white/10 hover:bg-black/[0.06] dark:hover:bg-white/[0.06]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 transition group-hover:bg-black/10 dark:group-hover:bg-white/10 group-hover:text-gray-900 dark:group-hover:text-white">
                    <Hash className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200 transition group-hover:text-gray-900 dark:group-hover:text-white">
                      #{tag.name}
                    </p>

                    <p className="truncate text-xs text-gray-600">
                      /tag/{tag.slug}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowedTagsModal;
