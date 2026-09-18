import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";

import MarkdownEditor from "../components/editor/MarkdownEditor.jsx";

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useAuth();

  const isEditMode = Boolean(id);

  // ==============================
  // States
  // ==============================

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");

  // Image File
  const [coverImage, setCoverImage] = useState(null);

  // Image Preview
  const [coverPreview, setCoverPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==============================
  // Load Existing Post
  // ==============================

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadPost = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await api.get("/posts/mine");

        const existingPost = response.data.find((post) => post._id === id);

        if (!existingPost) {
          setError("Post not found");
          return;
        }

        setTitle(existingPost.title || "");
        setContent(existingPost.content || "");
        setStatus(existingPost.status || "draft");

        if (existingPost.tags?.length > 0) {
          setTags(existingPost.tags.map((tag) => tag.name).join(", "));
        }

        // Existing Cloudinary image URL
        if (existingPost.coverImage) {
          setCoverPreview(existingPost.coverImage);
        }
      } catch (error) {
        console.error("Load post error:", error);

        setError(error.response?.data?.message || "Failed to load post");
      } finally {
        setFetching(false);
      }
    };

    loadPost();
  }, [id, isEditMode]);

  // ==============================
  // Image Select
  // ==============================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Allowed image types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed");

      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");

      return;
    }

    setError("");

    // Store actual file
    setCoverImage(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    setCoverPreview(previewUrl);
  };

  // ==============================
  // Remove Image
  // ==============================

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverPreview("");
  };

  // ==============================
  // Submit
  // ==============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setLoading(true);

      // =================================
      // FormData
      // =================================

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);

      // Tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      formData.append("tags", JSON.stringify(tagArray));

      // Image
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      // =================================
      // Edit
      // =================================

      if (isEditMode) {
        const response = await api.put(`/posts/${id}`, formData);

        setMessage(response.data.message || "Post updated successfully");

        if (response.data.post?.status === "published") {
          navigate(`/post/${response.data.post.slug}`);
        } else {
          navigate("/dashboard");
        }
      }

      // =================================
      // Create
      // =================================
      else {
        const response = await api.post("/posts", formData);

        setMessage(response.data.message || "Post created successfully");

        if (response.data.post?.status === "published") {
          navigate(`/post/${response.data.post.slug}`);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Save post error:", error);

      setError(error.response?.data?.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading post...</p>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Post" : "Create New Post"}
        </h1>

        <p className="text-gray-500 mt-2">
          {isEditMode
            ? "Update your blog post"
            : "Write and publish your blog post"}
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Success */}

      {message && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ============================== */}
        {/* Title */}
        {/* ============================== */}

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter post title"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        {/* ============================== */}
        {/* Cover Image */}
        {/* ============================== */}

        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            JPG, JPEG, PNG or WEBP — Maximum 5MB
          </p>

          {/* Preview */}

          {coverPreview && (
            <div className="mt-4 relative">
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-64 object-cover rounded-xl border"
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* ============================== */}
        {/* Tags */}
        {/* ============================== */}

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>

          <input
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="react, javascript, mongodb"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />

          <p className="mt-2 text-sm text-gray-500">
            Separate tags with commas.
          </p>
        </div>

        {/* ============================== */}
        {/* Markdown Editor */}
        {/* ============================== */}

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>

          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        {/* ============================== */}
        {/* Status */}
        {/* ============================== */}

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none"
          >
            <option value="draft">Draft</option>

            <option value="published">Published</option>
          </select>
        </div>

        {/* ============================== */}
        {/* Buttons */}
        {/* ============================== */}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-6 py-3 text-white font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
