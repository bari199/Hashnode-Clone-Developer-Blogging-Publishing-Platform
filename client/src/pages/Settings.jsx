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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-4xl font-bold">Settings</h1>

      <p className="mt-2 text-gray-600">Update your profile information.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-lg border bg-white p-6"
      >
        {/* Name */}

        <div>
          <label className="mb-2 block font-medium">Name</label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Bio */}

        <div>
          <label className="mb-2 block font-medium">Bio</label>

          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={200}
            rows={5}
            placeholder="Tell readers about yourself..."
            className="w-full resize-none rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <p className="mt-1 text-right text-sm text-gray-500">
            {bio.length}/200
          </p>
        </div>

        {/* Profile Image */}

        <div>
          <label className="mb-2 block font-medium">Profile Image</label>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="w-full rounded-md border px-4 py-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            JPG, JPEG, PNG or WEBP — Maximum 5MB
          </p>

          {/* Preview */}

          {avatarPreview && (
            <div className="mt-4">
              <img
                src={avatarPreview}
                alt="Profile Preview"
                className="h-32 w-32 rounded-full border object-cover"
              />
            </div>
          )}
        </div>

        {/* Success */}

        {message && (
          <p className="rounded-md bg-green-50 p-3 text-green-700">{message}</p>
        )}

        {/* Error */}

        {error && (
          <p className="rounded-md bg-red-50 p-3 text-red-600">{error}</p>
        )}

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
};

export default Settings;
