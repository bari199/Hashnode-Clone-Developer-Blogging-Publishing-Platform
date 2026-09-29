import { useEffect, useState } from "react";
import { X, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../api/axios.js";

const FollowListModal = ({ userId, type, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isFollowers = type === "followers";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const endpoint = isFollowers
          ? `/follows/users/${userId}/followers`
          : `/follows/users/${userId}/following`;

        const response = await api.get(endpoint);

        const list = isFollowers
          ? response.data?.followers || []
          : response.data?.following || [];

        setUsers(list);
      } catch (error) {
        console.error("Failed to load follow list:", error);

        setError(
          error.response?.data?.message ||
            `Failed to load ${isFollowers ? "followers" : "following"}.`,
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId && type) {
      fetchUsers();
    }
  }, [userId, type, isFollowers]);

  if (!type) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isFollowers ? "Followers" : "Following"}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {users.length}{" "}
              {isFollowers
                ? users.length === 1
                  ? "follower"
                  : "followers"
                : users.length === 1
                  ? "person"
                  : "people"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              Loading...
            </div>
          )}

          {!loading && error && (
            <div className="px-6 py-12 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="px-6 py-12 text-center">
              <UserRound className="mx-auto h-10 w-10 text-gray-600" />

              <p className="mt-3 text-sm text-gray-400">
                {isFollowers
                  ? "No followers yet."
                  : "Not following anyone yet."}
              </p>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="divide-y divide-white/5">
              {users.map((user) => {
                const userData = isFollowers ? user.follower : user.following;

                if (!userData?._id) {
                  return null;
                }

                return (
                  <Link
                    key={user._id}
                    to={`/profile/${userData._id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-6 py-4 transition hover:bg-white/[0.04]"
                  >
                    {/* Avatar */}
                    {userData.avatarUrl ? (
                      <img
                        src={userData.avatarUrl}
                        alt={userData.name || "User"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                        {userData.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    {/* User information */}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {userData.name || "Unnamed user"}
                      </p>

                      {userData.username && (
                        <p className="truncate text-sm text-gray-500">
                          @{userData.username}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
