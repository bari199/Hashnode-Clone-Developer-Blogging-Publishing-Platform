import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  FileText,
  Hash,
  MapPin,
  MessageCircle,
  Users,
  UserRound,
} from "lucide-react";

import useFollow from "../hooks/useFollow.js";
import api from "../api/axios.js";

import PostList from "../components/post/PostList.jsx";
import FollowListModal from "../components/profile/FollowListModal.jsx";
import FollowedTagsModal from "../components/profile/FollowedTagsModal.jsx";

const Profile = () => {
  const { id } = useParams();

  // =========================================
  // Profile State
  // =========================================

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // Follow State
  // =========================================

  const {
    following,
    followerCount,
    followingCount,
    loading: followLoading,
    submitting: followSubmitting,
    canFollow,
    isOwnProfile,
    toggleFollow,
  } = useFollow(id);

  // =========================================
  // Follow Modal State
  // =========================================

  const [followListType, setFollowListType] = useState(null);

  // =========================================
  // Followed Tags State
  // =========================================

  const [followedTags, setFollowedTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [showTagsModal, setShowTagsModal] = useState(false);

  // =========================================
  // Bookmark State
  // =========================================

  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [bookmarkLoading, setBookmarkLoading] = useState(true);

  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [bookmarksError, setBookmarksError] = useState("");

  // =========================================
  // Comment State
  // =========================================

  const [commentCount, setCommentCount] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [userComments, setUserComments] = useState([]);

  // =========================================
  // Content Tab State
  // =========================================

  const [activeTab, setActiveTab] = useState("articles");

  // =========================================
  // Fetch Profile And Published Posts
  // =========================================

  useEffect(() => {
    let ignore = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/users/${id}`);

        if (ignore) return;

        setProfile(response.data?.user || null);
        setPosts(response.data?.posts || []);
      } catch (err) {
        if (ignore) return;

        setProfile(null);
        setPosts([]);

        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (!id) {
      setProfile(null);
      setPosts([]);
      setError("Profile not found.");
      setLoading(false);
    } else {
      fetchProfile();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  // =========================================
  // Fetch Followed Tags
  // =========================================

  useEffect(() => {
    let ignore = false;

    const fetchFollowedTags = async () => {
      try {
        setTagsLoading(true);

        const response = await api.get(`/follows/users/${id}/tags`);

        if (ignore) return;

        setFollowedTags(response.data?.tags || []);
      } catch (err) {
        if (ignore) return;

        console.error(
          "Failed to load followed tags:",
          err.response?.data?.message || err.message,
        );

        setFollowedTags([]);
      } finally {
        if (!ignore) {
          setTagsLoading(false);
        }
      }
    };

    if (!id) {
      setFollowedTags([]);
      setTagsLoading(false);
    } else {
      fetchFollowedTags();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  // =========================================
  // Fetch Bookmark Count
  // =========================================

  useEffect(() => {
    let ignore = false;

    const fetchBookmarkCount = async () => {
      try {
        setBookmarkLoading(true);

        const response = await api.get(
          `/interactions/users/${id}/bookmarks/count`,
        );

        if (ignore) return;

        setBookmarkCount(response.data?.bookmarkCount || 0);
      } catch (err) {
        if (ignore) return;

        console.error(
          "Failed to fetch bookmark count:",
          err.response?.data?.message || err.message,
        );

        setBookmarkCount(0);
      } finally {
        if (!ignore) {
          setBookmarkLoading(false);
        }
      }
    };

    if (!id) {
      setBookmarkCount(0);
      setBookmarkLoading(false);
    } else {
      fetchBookmarkCount();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  // =========================================
  // Fetch Bookmarked Posts
  // Only For Own Profile
  // =========================================

  useEffect(() => {
    let ignore = false;

    const fetchBookmarkedPosts = async () => {
      try {
        setBookmarksLoading(true);
        setBookmarksError("");

        const response = await api.get(`/interactions/users/${id}/bookmarks`);

        if (ignore) return;

        setBookmarkedPosts(response.data?.posts || []);
      } catch (err) {
        if (ignore) return;

        console.error(
          "Failed to fetch bookmarked posts:",
          err.response?.data?.message || err.message,
        );

        setBookmarkedPosts([]);

        setBookmarksError(
          err.response?.data?.message || "Failed to load bookmarked articles.",
        );
      } finally {
        if (!ignore) {
          setBookmarksLoading(false);
        }
      }
    };

    if (id && isOwnProfile) {
      fetchBookmarkedPosts();
    } else {
      setBookmarkedPosts([]);
      setBookmarksError("");
      setBookmarksLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [id, isOwnProfile]);

  // =========================================
  // Fetch User Comments
  // =========================================

  useEffect(() => {
    let ignore = false;

    const fetchUserComments = async () => {
      try {
        setCommentsLoading(true);
        setCommentsError("");

        const response = await api.get(`/comments/users/${id}`);

        if (ignore) return;

        setUserComments(response.data?.comments || []);
        setCommentCount(response.data?.totalComments || 0);
      } catch (err) {
        if (ignore) return;

        console.error(
          "Failed to fetch user comments:",
          err.response?.data?.message || err.message,
        );

        setUserComments([]);
        setCommentCount(0);

        setCommentsError(
          err.response?.data?.message || "Failed to load comments.",
        );
      } finally {
        if (!ignore) {
          setCommentsLoading(false);
        }
      }
    };

    if (id) {
      fetchUserComments();
    } else {
      setUserComments([]);
      setCommentCount(0);
      setCommentsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  // =========================================
  // Loading State
  // =========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] text-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center text-sm text-gray-400">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  // =========================================
  // Error State
  // =========================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] text-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-5">
            <p className="text-center text-sm text-red-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================
  // Profile Not Found
  // =========================================

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] text-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center text-gray-400">Profile not found.</p>
        </div>
      </main>
    );
  }

  // =========================================
  // Main Profile Page
  // =========================================

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-gray-200">
      {/* ===================================== */}
      {/* Profile Header */}
      {/* ===================================== */}

      <section className="border-b border-white/10 bg-[#0e0e12] px-5 py-12 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          {/* Avatar */}

          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name || "Profile"}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-white/5"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-white ring-4 ring-white/5">
              {profile.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          {/* Name */}

          <h1 className="mt-5 text-3xl font-bold text-white">
            {profile.name || "Anonymous User"}
          </h1>

          {/* Username, Location And Join Date */}

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
            {profile.username && <span>@{profile.username}</span>}

            {profile.location && (
              <>
                {(profile.username || profile.createdAt) && <span>·</span>}

                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              </>
            )}

            {profile.createdAt && (
              <>
                <span>·</span>

                <span>
                  Joined{" "}
                  {new Date(profile.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </>
            )}
          </div>

          {/* Bio */}

          {profile.bio ? (
            <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-gray-400">
              {profile.bio}
            </p>
          ) : (
            isOwnProfile && (
              <p className="mt-4 text-sm text-gray-600">
                Add a tagline to introduce yourself.
              </p>
            )
          )}

          {/* Profile Actions */}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isOwnProfile && (
              <Link
                to="/settings"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Edit Profile
              </Link>
            )}

            {canFollow && (
              <button
                type="button"
                onClick={toggleFollow}
                disabled={followLoading || followSubmitting}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  following
                    ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {followSubmitting
                  ? "Please wait..."
                  : following
                    ? "Following"
                    : "Follow"}
              </button>
            )}
          </div>

          {/* ===================================== */}
          {/* Profile Statistics */}
          {/* ===================================== */}

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-5 sm:gap-x-10">
            {/* Followers */}

            <button
              type="button"
              onClick={() => setFollowListType("followers")}
              className="min-w-[60px] text-center transition hover:opacity-75"
            >
              <p className="text-xl font-bold text-white">{followerCount}</p>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">Followers</p>
            </button>

            {/* Following */}

            <button
              type="button"
              onClick={() => setFollowListType("following")}
              className="min-w-[60px] text-center transition hover:opacity-75"
            >
              <p className="text-xl font-bold text-white">{followingCount}</p>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">Following</p>
            </button>

            {/* Followed Tags */}

            <button
              type="button"
              onClick={() => setShowTagsModal(true)}
              disabled={tagsLoading}
              className="min-w-[60px] text-center transition hover:opacity-75 disabled:cursor-default"
            >
              <p className="text-xl font-bold text-white">
                {tagsLoading ? "—" : followedTags.length}
              </p>

              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-500 sm:text-sm">
                <Hash className="h-3.5 w-3.5" />
                Tags
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* Profile Content */}
      {/* ===================================== */}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-8 sm:px-6 md:grid-cols-[260px_minmax(0,1fr)] md:gap-10 md:py-10">
        {/* =================================== */}
        {/* Left Sidebar */}
        {/* =================================== */}

        <aside className="space-y-5">
          {/* About Card */}

          <section className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-gray-400" />

              <h2 className="text-base font-semibold text-white">About</h2>
            </div>

            {profile.bio ? (
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-400">
                {profile.bio}
              </p>
            ) : (
              <p className="mt-4 text-sm leading-6 text-gray-500">
                {isOwnProfile
                  ? "Tell others about yourself."
                  : "No bio available."}
              </p>
            )}

            {isOwnProfile && (
              <Link
                to="/settings"
                className="mt-4 inline-flex rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Edit profile
              </Link>
            )}
          </section>

          {/* Available For Card */}

          <section className="rounded-xl border border-white/10 bg-[#101014] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />

              <h2 className="text-base font-semibold text-white">
                Available for
              </h2>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Let people know what you are open to.
            </p>

            {isOwnProfile && (
              <Link
                to="/settings"
                className="mt-4 inline-flex rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Edit profile
              </Link>
            )}
          </section>
        </aside>

        {/* =================================== */}
        {/* Right Content */}
        {/* =================================== */}

        <div className="min-w-0">
          {/* ================================= */}
          {/* Profile Content Tabs */}
          {/* ================================= */}

          <section>
            {/* Tabs Header */}

            <div className="mb-6 border-b border-white/10">
              <div className="flex items-center gap-6 overflow-x-auto">
                {/* Articles Tab */}

                <button
                  type="button"
                  onClick={() => setActiveTab("articles")}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                    activeTab === "articles"
                      ? "border-white text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Articles
                  <span className="text-xs text-gray-600">{posts.length}</span>
                </button>

                {/* Comments Tab */}

                <button
                  type="button"
                  onClick={() => setActiveTab("comments")}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                    activeTab === "comments"
                      ? "border-white text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Comments
                  <span className="text-xs text-gray-600">
                    {commentsLoading ? "—" : commentCount}
                  </span>
                </button>

                {/* Bookmarks Tab */}

                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("bookmarks")}
                    className={`flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                      activeTab === "bookmarks"
                        ? "border-white text-white"
                        : "border-transparent text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Bookmark className="h-4 w-4" />
                    Bookmarks
                    <span className="text-xs text-gray-600">
                      {bookmarkLoading ? "—" : bookmarkCount}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* ================================= */}
            {/* ARTICLES */}
            {/* ================================= */}

            {activeTab === "articles" && (
              <div>
                {posts.length === 0 ? (
                  <div className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] px-5 py-14 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-gray-500">
                      <FileText className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 font-semibold text-white">
                      No articles yet
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                      {isOwnProfile
                        ? "Your published articles will appear here."
                        : "This user has not published any articles yet."}
                    </p>
                  </div>
                ) : (
                  <PostList posts={posts} />
                )}
              </div>
            )}

            {/* ================================= */}
            {/* COMMENTS */}
            {/* ================================= */}

            {activeTab === "comments" && (
              <div>
                {commentsLoading ? (
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] py-14 text-center">
                    <p className="text-sm text-gray-500">Loading comments...</p>
                  </div>
                ) : commentsError ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-5">
                    <p className="text-center text-sm text-red-400">
                      {commentsError}
                    </p>
                  </div>
                ) : userComments.length === 0 ? (
                  <div className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] px-5 py-14 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-gray-500">
                      <MessageCircle className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 font-semibold text-white">
                      No comments yet
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                      {isOwnProfile
                        ? "Your comments and replies will appear here."
                        : "This user has not commented on any article yet."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userComments.map((comment) => (
                      <article
                        key={comment._id}
                        className="rounded-xl border border-white/10 bg-[#101014] p-5 transition hover:border-white/15"
                      >
                        <div className="flex items-start gap-3">
                          <MessageCircle className="mt-1 h-4 w-4 shrink-0 text-gray-500" />

                          <div className="min-w-0 flex-1">
                            {/* Comment Content */}

                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
                              {comment.content}
                            </p>

                            {/* Parent Reply Indicator */}

                            {comment.parentComment && (
                              <p className="mt-2 text-xs text-gray-600">
                                Reply
                              </p>
                            )}

                            {/* Post */}

                            {comment.post && (
                              <Link
                                to={`/post/${comment.post.slug}`}
                                className="mt-4 block rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:bg-white/[0.05]"
                              >
                                <p className="text-xs text-gray-500">
                                  Commented on
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-gray-200">
                                  {comment.post.title}
                                </p>
                              </Link>
                            )}

                            {/* Date */}

                            {comment.createdAt && (
                              <p className="mt-3 text-xs text-gray-600">
                                {new Date(comment.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================================= */}
            {/* BOOKMARKS */}
            {/* ================================= */}

            {activeTab === "bookmarks" && isOwnProfile && (
              <div>
                {bookmarksLoading ? (
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] py-14 text-center">
                    <p className="text-sm text-gray-500">
                      Loading bookmarks...
                    </p>
                  </div>
                ) : bookmarksError ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-5">
                    <p className="text-center text-sm text-red-400">
                      {bookmarksError}
                    </p>
                  </div>
                ) : bookmarkedPosts.length === 0 ? (
                  <div className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.02] px-5 py-14 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-gray-500">
                      <Bookmark className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 font-semibold text-white">
                      No bookmarked articles
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                      Articles you bookmark will appear here.
                    </p>
                  </div>
                ) : (
                  <PostList posts={bookmarkedPosts} />
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ===================================== */}
      {/* Followers / Following Modal */}
      {/* ===================================== */}

      {followListType && (
        <FollowListModal
          userId={id}
          type={followListType}
          onClose={() => setFollowListType(null)}
        />
      )}

      {/* ===================================== */}
      {/* Followed Tags Modal */}
      {/* ===================================== */}

      {showTagsModal && (
        <FollowedTagsModal
          tags={followedTags}
          onClose={() => setShowTagsModal(false)}
        />
      )}
    </main>
  );
};

export default Profile;
