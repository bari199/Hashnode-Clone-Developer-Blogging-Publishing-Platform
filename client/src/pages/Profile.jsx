import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";
import api from "../api/axios.js";
import PostList from "../components/post/PostList.jsx";

const Profile = () => {
  const { id } = useParams();

  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // Fetch Profile
  // =====================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/users/${id}`);

        setProfile(response.data.user);
        setPosts(response.data.posts || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // =====================================
  // Check Own Profile
  // =====================================

  const isOwnProfile = loggedInUser?._id === profile?._id;

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0f]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-gray-400">Loading profile...</p>
        </div>
      </main>
    );
  }

  // =====================================
  // Error
  // =====================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#0b0b0f]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-red-400">{error}</p>
        </div>
      </main>
    );
  }

  // =====================================
  // No Profile
  // =====================================

  if (!profile) {
    return null;
  }

  // =====================================
  // Profile
  // =====================================

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-gray-200">
      {/* ================================= */}
      {/* Profile Header */}
      {/* ================================= */}

      <section className="border-b border-white/10 bg-[#0e0e12] px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          {/* ================================= */}
          {/* Avatar */}
          {/* ================================= */}

          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-white/5"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-white ring-4 ring-white/5">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* ================================= */}
          {/* Information */}
          {/* ================================= */}

          <h1 className="mt-5 text-3xl font-bold text-white">{profile.name}</h1>

          <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
            {profile.username && <span>@{profile.username}</span>}
            {profile.location && (
              <>
                <span>·</span>
                <span>{profile.location}</span>
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
          </p>

          {profile.bio ? (
            <p className="mt-3 max-w-2xl text-gray-400">{profile.bio}</p>
          ) : (
            isOwnProfile && <p className="mt-3 text-gray-600">Add a tagline</p>
          )}

          {/* ================================= */}
          {/* Edit Profile */}
          {/* ================================= */}

          {isOwnProfile && (
            <Link
              to="/settings"
              className="mt-5 inline-block rounded-md bg-white px-5 py-2 font-medium text-black hover:bg-gray-200"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </section>

      {/* ================================= */}
      {/* Body */}
      {/* ================================= */}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-10 md:grid-cols-[280px_1fr]">
        {/* ================================= */}
        {/* Sidebar */}
        {/* ================================= */}

        <div className="space-y-6">
          <div className="rounded-lg border border-white/10 bg-[#101014] p-6">
            <h2 className="text-lg font-bold text-white">About</h2>

            {profile.bio ? (
              <p className="mt-4 text-gray-400">{profile.bio}</p>
            ) : (
              <p className="mt-4 text-gray-500">Tell others about yourself.</p>
            )}

            {isOwnProfile && (
              <Link
                to="/settings"
                className="mt-4 inline-block rounded-md bg-white/10 px-4 py-1.5 text-sm text-gray-200 hover:bg-white/20"
              >
                Edit profile
              </Link>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-[#101014] p-6">
            <h2 className="text-lg font-bold text-white">Available for</h2>

            <p className="mt-4 text-gray-500">
              Let people know what you're open to.
            </p>

            {isOwnProfile && (
              <Link
                to="/settings"
                className="mt-4 inline-block rounded-md bg-white/10 px-4 py-1.5 text-sm text-gray-200 hover:bg-white/20"
              >
                Edit profile
              </Link>
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* Published Posts */}
        {/* ================================= */}

        <section>
          <div className="mb-6 flex items-center gap-6 border-b border-white/10">
            <span className="border-b-2 border-white pb-3 font-semibold text-white">
              Articles
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <p className="mt-4 font-semibold text-white">No articles yet</p>
              <p className="mt-1 text-gray-500">
                No articles have been published yet.
              </p>
            </div>
          ) : (
            <PostList posts={posts} />
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
