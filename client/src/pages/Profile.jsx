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
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center">Loading profile...</p>
      </main>
    );
  }

  // =====================================
  // Error
  // =====================================

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-red-500">{error}</p>
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
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* ================================= */}
      {/* Profile Header */}
      {/* ================================= */}

      <section className="rounded-lg border bg-white p-8">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          {/* ================================= */}
          {/* Avatar */}
          {/* ================================= */}

          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* ================================= */}
          {/* Information */}
          {/* ================================= */}

          <div className="mt-5 sm:ml-6 sm:mt-0">
            <h1 className="text-3xl font-bold">{profile.name}</h1>

            {profile.bio && (
              <p className="mt-3 max-w-2xl text-gray-600">{profile.bio}</p>
            )}
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* Edit Profile */}
      {/* ================================= */}

      {isOwnProfile && (
        <Link
          to="/settings"
          className="mt-5 inline-block rounded-md bg-black px-5 py-2 text-white hover:bg-gray-800"
        >
          Edit Profile
        </Link>
      )}

      {/* ================================= */}
      {/* Published Posts */}
      {/* ================================= */}

      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold">Published Posts</h2>

        <PostList posts={posts} />
      </section>
    </main>
  );
};

export default Profile;
