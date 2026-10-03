import { useEffect, useRef, useState } from "react";

import { Search, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";

import useUserSearch from "../../hooks/useUserSearch.js";
import useFollow from "../../hooks/useFollow.js";

const UserSearchResult = ({ user, onSelect }) => {
  const { following, loading, submitting, canFollow, toggleFollow } = useFollow(
    user._id,
  );

  const handleFollow = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    await toggleFollow();
  };

  return (
    <div className="flex items-center gap-4 px-4 py-3 transition hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
      <Link
        to={`/profile/${user._id}`}
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name || "User"}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/10 text-sm font-semibold text-gray-900 dark:bg-white/10 dark:text-white">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {user.name || "Unnamed user"}
          </p>

          {user.bio && (
            <p className="mt-0.5 truncate text-xs text-gray-500">{user.bio}</p>
          )}
        </div>
      </Link>

      {canFollow && (
        <button
          type="button"
          onClick={handleFollow}
          disabled={loading || submitting}
          className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            following
              ? "border border-black/10 bg-black/10 text-gray-900 hover:bg-black/15 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {submitting ? "..." : following ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

const UserSearch = ({ mobile = false }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef(null);

  const { users, loading, error } = useUserSearch(query);

  /*
   * =====================================
   * Close search on outside click
   * =====================================
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /*
   * =====================================
   * Close search with Escape key
   * =====================================
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /*
   * =====================================
   * Search input change
   * =====================================
   */
  const handleChange = (event) => {
    const value = event.target.value;

    setQuery(value);
    setIsOpen(value.trim().length > 0);
  };

  /*
   * =====================================
   * Clear search
   * =====================================
   */
  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  /*
   * =====================================
   * Input focus
   * =====================================
   */
  const handleFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  /*
   * =====================================
   * Search results
   * =====================================
   */
  const searchResults = (
    <>
      {loading && (
        <div className="px-4 py-6 text-center text-sm text-gray-500">
          Searching...
        </div>
      )}

      {!loading && error && (
        <div className="px-4 py-6 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="px-4 py-8 text-center">
          <UserRound className="mx-auto h-8 w-8 text-gray-600" />

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            No users found.
          </p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="max-h-[360px] overflow-y-auto">
          {users.map((user) => (
            <UserSearchResult
              key={user._id}
              user={user}
              onSelect={() => setIsOpen(false)}
            />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div
      ref={searchRef}
      className={`relative w-full ${mobile ? "max-w-none" : "max-w-md"}`}
    >
      {/* Search Input */}
      <div
        className={`flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-2.5 transition dark:bg-[#101014] ${
          isOpen
            ? "border-black/20 dark:border-white/20"
            : "border-black/10 dark:border-white/10"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-gray-500" />

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Search people..."
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-600"
          autoFocus={mobile}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-md p-1 text-gray-500 transition hover:bg-black/10 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Desktop Search Results */}
      {!mobile && isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#101014]">
          {searchResults}
        </div>
      )}

      {/* Mobile Search Results */}
      {mobile && isOpen && (
        <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#101014]">
          {searchResults}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
