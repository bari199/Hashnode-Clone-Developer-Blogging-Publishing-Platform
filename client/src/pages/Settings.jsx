import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth.js";
import api from "../api/axios.js";

const Settings = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // Load User
  // =====================================

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setBio(user.bio || "");
    setAvatarPreview(user.avatarUrl || "");
  }, [user]);

  // =====================================
  // Select Avatar
  // =====================================

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    console.log("Selected file:", file);
    console.log("Is File:", file instanceof File);

    // Allowed types

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed");

      return;
    }

    // 5MB

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");

      return;
    }

    setError("");
    setMessage("");

    // Save actual File

    setAvatar(file);

    // Preview

    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };

  // =====================================
  // Submit
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      // =================================
      // FormData
      // =================================

      const formData = new FormData();

      formData.append("name", name);

      formData.append("bio", bio);

      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }

      for (const [key, value] of formData.entries()) {
        console.log("FormData:", key, value);
      }
      // =================================
      // API
      // =================================

      const response = await api.put("/users/me", formData);

      // =================================
      // Update Context
      // =================================

      updateUser(response.data.user);

      // =================================
      // Update Preview
      // =================================

      setAvatarPreview(response.data.user.avatarUrl || "");

      setAvatar(null);

      setMessage(response.data.message || "Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);

      console.error("Response:", error.response?.data);

      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-gray-200">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-lg font-bold text-white">Settings</h1>

        {/* Tabs (visual only — no routing/logic added) */}
        <div className="mt-6 flex rounded-lg bg-[#101014] p-1">
          <span className="flex-1 cursor-default rounded-md bg-white/10 py-2 text-center text-sm font-medium text-white">
            Profile
          </span>
          <span className="flex-1 cursor-default rounded-md py-2 text-center text-sm text-gray-500">
            Email
          </span>
          <span className="flex-1 cursor-default rounded-md py-2 text-center text-sm text-gray-500">
            Developer
          </span>
          <span className="flex-1 cursor-default rounded-md py-2 text-center text-sm text-gray-500">
            Account
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid grid-cols-1 gap-8 rounded-lg border border-white/10 bg-[#101014] p-6 sm:grid-cols-[1fr_auto]">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="mb-1 block font-medium text-white">
                  Full name
                </label>
                <p className="mb-2 text-sm text-gray-500">
                  The name shown on your profile and posts.
                </p>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-[#0b0b0f] px-4 py-3 text-gray-200 outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1 block font-medium text-white">
                  About you
                </label>
                <p className="mb-2 text-sm text-gray-500">
                  A short bio shown on your profile and author card.
                </p>

                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={200}
                  rows={5}
                  placeholder="Tell readers about the topics you write on."
                  className="w-full resize-none rounded-md border border-white/10 bg-[#0b0b0f] px-4 py-3 text-gray-200 outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-white/30"
                />

                <p className="mt-1 text-right text-sm text-gray-600">
                  {bio.length}/200
                </p>
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-1 block font-medium text-white">
                  Profile Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="w-full rounded-md border border-white/10 bg-[#0b0b0f] px-4 py-3 text-gray-400 file:mr-4 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-gray-200"
                />

                <p className="mt-2 text-sm text-gray-500">
                  JPG, JPEG, PNG or WEBP — Maximum 5MB
                </p>
              </div>
            </div>

            {/* Avatar preview, positioned like the screenshot */}
            <div className="flex justify-center sm:justify-start">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile Preview"
                  className="h-24 w-24 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white">
                  {name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Success */}
          {message && (
            <p className="mt-6 rounded-md bg-green-500/10 p-3 text-green-400">
              {message}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="mt-6 rounded-md bg-red-500/10 p-3 text-red-400">
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-white px-6 py-2.5 font-medium text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Settings;
