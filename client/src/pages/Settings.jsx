import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import api from "../api/axios.js";

const Settings = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setBio(user.bio || "");
    setAvatarUrl(user.avatarUrl || "");
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/users/me",
        {
          name,
          bio,
          avatarUrl,
        },
      );

      updateUser(response.data.user);

      setMessage(response.data.message || "Profile updated successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Avatar URL */}
        <div>
          <label className="mb-2 block font-medium">Avatar URL</label>

          <input
            type="url"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
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
