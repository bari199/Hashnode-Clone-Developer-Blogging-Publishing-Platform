import { useEffect, useState } from "react";
import { FaGithub, FaGlobe, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import useAuth from "../hooks/useAuth.js";
import api from "../api/axios.js";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();

  // =====================================
  // Active Tab
  // =====================================

  const [activeTab, setActiveTab] = useState("profile");

  // =====================================
  // Profile State
  // =====================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // =====================================
  // Social Links
  // =====================================

  const [socialLinks, setSocialLinks] = useState({
    x: "",
    linkedin: "",
    github: "",
    website: "",
  });

  // =====================================
  // UI State
  // =====================================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // Delete Account State
  // =====================================

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // =====================================
  // Load User
  // =====================================

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setEmail(user.email || "");
    setBio(user.bio || "");
    setLocation(user.location || "");
    setAvatarPreview(user.avatarUrl || "");

    setSocialLinks({
      x: user.socialLinks?.x || "",
      linkedin: user.socialLinks?.linkedin || "",
      github: user.socialLinks?.github || "",
      website: user.socialLinks?.website || "",
    });
  }, [user]);

  // =====================================
  // Social Link Change
  // =====================================

  const handleSocialLinkChange = (field, value) => {
    setSocialLinks((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =====================================
  // Avatar Change
  // =====================================

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setMessage("");
    setAvatar(file);

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  // =====================================
  // Save Profile
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      // Send fields
      formData.append("name", name);
      formData.append("email", email);
      formData.append("bio", bio);
      formData.append("location", location);
      formData.append("socialLinks", JSON.stringify(socialLinks));

      // Send avatar only when selected
      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }

      const response = await api.put("/users/me", formData);

      updateUser(response.data?.user);

      setName(response.data?.user?.name || "");
      setEmail(response.data?.user?.email || "");
      setBio(response.data?.user?.bio || "");
      setLocation(response.data?.user?.location || "");

      setSocialLinks({
        x: response.data?.user?.socialLinks?.x || "",
        linkedin: response.data?.user?.socialLinks?.linkedin || "",
        github: response.data?.user?.socialLinks?.github || "",
        website: response.data?.user?.socialLinks?.website || "",
      });

      setAvatarPreview(response.data?.user?.avatarUrl || "");

      setAvatar(null);

      setMessage(response.data?.message || "Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);

      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Delete Account
  // =====================================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await api.delete("/users/me");

      // Clear local authentication
      logout();

      // Go to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Delete account error:", error);

      setDeleteError(
        error.response?.data?.message || "Failed to delete account",
      );

      setDeleteLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b0b0f] text-gray-800 dark:text-gray-200">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* =====================================
            Header
        ===================================== */}

        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Settings
        </h1>

        {/* =====================================
            Tabs
        ===================================== */}

        <div className="mt-6 flex rounded-lg bg-gray-50 dark:bg-[#101014] p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setMessage("");
              setError("");
            }}
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition ${
              activeTab === "profile"
                ? "bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Profile
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("email");
              setMessage("");
              setError("");
            }}
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition ${
              activeTab === "email"
                ? "bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Email
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("developer");
              setMessage("");
              setError("");
            }}
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition ${
              activeTab === "developer"
                ? "bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Developer
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("account");
              setMessage("");
              setError("");
              setDeleteError("");
            }}
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition ${
              activeTab === "account"
                ? "bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Account
          </button>
        </div>

        {/* =====================================
            PROFILE TAB
        ===================================== */}

        {activeTab === "profile" && (
          <form onSubmit={handleSubmit}>
            {/* Profile Information */}

            <div className="mt-8 grid grid-cols-1 gap-8 rounded-lg border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#101014] p-6 sm:grid-cols-[1fr_auto]">
              <div className="space-y-6">
                {/* Name */}

                <div>
                  <label className="mb-1 block font-medium text-gray-900 dark:text-white">
                    Full name
                  </label>

                  <p className="mb-2 text-sm text-gray-500">
                    The name shown on your profile and posts.
                  </p>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0f] px-4 py-3 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30"
                    required
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="mb-1 block font-medium text-gray-900 dark:text-white">
                    Email
                  </label>

                  <p className="mb-2 text-sm text-gray-500">
                    Your account email address.
                  </p>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full cursor-allowed rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0f] px-4 py-3 text-gray-900 dark:text-white outline-none"
                  />
                </div>

                {/* Location */}

                <div>
                  <label className="mb-1 block font-medium text-gray-900 dark:text-white">
                    Location
                  </label>

                  <p className="mb-2 text-sm text-gray-500">
                    Where you are based.
                  </p>

                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    maxLength={100}
                    placeholder="Kolkata, India"
                    className="w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0f] px-4 py-3 text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30"
                  />
                </div>

                {/* Bio */}

                <div>
                  <label className="mb-1 block font-medium text-gray-900 dark:text-white">
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
                    className="w-full resize-none rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0f] px-4 py-3 text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30"
                  />

                  <p className="mt-1 text-right text-sm text-gray-600">
                    {bio.length}/200
                  </p>
                </div>

                {/* Profile Image */}

                <div>
                  <label className="mb-1 block font-medium text-gray-900 dark:text-white">
                    Profile Image
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0f] px-4 py-3 text-gray-500 dark:text-gray-400 file:mr-4 file:rounded file:border-0 file:bg-black/10 dark:file:bg-white/10 file:px-3 file:py-1.5 file:text-gray-800 dark:file:text-gray-200"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    JPG, JPEG, PNG or WEBP — Maximum 5MB
                  </p>
                </div>
              </div>

              {/* Avatar Preview */}

              <div className="flex justify-center sm:justify-start">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile Preview"
                    className="h-24 w-24 rounded-full border border-black/10 dark:border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-2xl font-bold text-gray-900 dark:text-white">
                    {name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}

            <div className="mt-8 rounded-lg border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#101014] p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Social links
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add links to your social profiles and website.
              </p>

              <div className="mt-6 space-y-3">
                {/* X */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-gray-500 dark:text-gray-400">
                    <FaXTwitter className="h-4 w-4" />
                  </div>

                  <input
                    type="url"
                    value={socialLinks.x}
                    onChange={(event) =>
                      handleSocialLinkChange("x", event.target.value)
                    }
                    placeholder="https://x.com/username"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181d] px-4 text-sm text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-black/20 dark:focus:border-white/20 focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>

                {/* LinkedIn */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-gray-500 dark:text-gray-400">
                    <FaLinkedinIn className="h-4 w-4" />
                  </div>

                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(event) =>
                      handleSocialLinkChange("linkedin", event.target.value)
                    }
                    placeholder="https://www.linkedin.com/in/username/"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181d] px-4 text-sm text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-black/20 dark:focus:border-white/20 focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>

                {/* GitHub */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-gray-500 dark:text-gray-400">
                    <FaGithub className="h-4 w-4" />
                  </div>

                  <input
                    type="url"
                    value={socialLinks.github}
                    onChange={(event) =>
                      handleSocialLinkChange("github", event.target.value)
                    }
                    placeholder="https://github.com/username"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181d] px-4 text-sm text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-black/20 dark:focus:border-white/20 focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>

                {/* Website */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/[0.04] text-gray-500 dark:text-gray-400">
                    <FaGlobe className="h-4 w-4" />
                  </div>

                  <input
                    type="url"
                    value={socialLinks.website}
                    onChange={(event) =>
                      handleSocialLinkChange("website", event.target.value)
                    }
                    placeholder="https://example.com"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181d] px-4 text-sm text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-black/20 dark:focus:border-white/20 focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}

            {message && (
              <p className="mt-6 rounded-md bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                {message}
              </p>
            )}

            {error && (
              <p className="mt-6 rounded-md bg-red-500/10 p-3 text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            {/* Save */}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-gray-900 dark:bg-white px-6 py-2.5 font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}

        {/* =====================================
            EMAIL TAB
        ===================================== */}

        {activeTab === "email" && (
          <section className="mt-8 rounded-lg border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#101014] p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Email settings
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your current account email address is shown below.
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Email address
              </label>

              <input
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0f] px-4 py-3 text-gray-500 outline-none"
              />
            </div>
          </section>
        )}

        {/* =====================================
            DEVELOPER TAB
        ===================================== */}

        {activeTab === "developer" && (
          <section className="mt-8 rounded-lg border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#101014] p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Developer settings
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Developer-related settings will appear here.
            </p>
          </section>
        )}

        {/* =====================================
            ACCOUNT TAB
        ===================================== */}

        {activeTab === "account" && (
          <section className="mt-8">
            {/* Account Information */}

            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#101014] p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Manage your account and security preferences.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Account email
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {email || "No email available"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Account status
                  </p>

                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    Active
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}

            <section className="mt-6 rounded-lg border border-red-500/20 bg-red-500/[0.03] p-6">
              <div>
                <h2 className="text-base font-semibold text-red-600 dark:text-red-400">
                  Delete account
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Permanently delete your account and remove your profile
                  information. This action cannot be undone.
                </p>
              </div>

              {deleteError && (
                <p className="mt-4 rounded-md bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                  {deleteError}
                </p>
              )}

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete account"}
              </button>
            </section>
          </section>
        )}
      </div>
    </main>
  );
};

export default Settings;
