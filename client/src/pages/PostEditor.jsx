import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image as ImageIcon, Search, X } from "lucide-react";

import api from "../api/axios.js";
import MarkdownEditor from "../components/editor/MarkdownEditor.jsx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // ============================================
  // Article States
  // ============================================

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");

  // ============================================
  // Cover Image States
  // ============================================

  // Local uploaded File
  const [coverImage, setCoverImage] = useState(null);

  // Preview URL
  const [coverPreview, setCoverPreview] = useState("");

  // Unsplash image URL
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // Unsplash attribution information
  const [coverImageAuthor, setCoverImageAuthor] = useState("");
  const [coverImageAuthorUrl, setCoverImageAuthorUrl] = useState("");
  const [coverImageUnsplashUrl, setCoverImageUnsplashUrl] = useState("");

  // ============================================
  // General States
  // ============================================

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================
  // Unsplash States
  // ============================================

  const [unsplashOpen, setUnsplashOpen] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashPhotos, setUnsplashPhotos] = useState([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashError, setUnsplashError] = useState("");

  // ============================================
  // Load Existing Post
  // ============================================

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadPost = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await api.get("/posts/mine");

        const existingPost = response.data.posts.find(
          (post) => post._id === id,
        );

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

        if (existingPost.coverImage) {
          setCoverPreview(existingPost.coverImage);
        }

        // Unsplash metadata if available
        setCoverImageUrl(existingPost.coverImageUrl || "");
        setCoverImageAuthor(existingPost.coverImageAuthor || "");
        setCoverImageAuthorUrl(existingPost.coverImageAuthorUrl || "");
        setCoverImageUnsplashUrl(existingPost.coverImageUnsplashUrl || "");
      } catch (error) {
        console.error("Load post error:", error);

        setError(error.response?.data?.message || "Failed to load post.");
      } finally {
        setFetching(false);
      }
    };

    loadPost();
  }, [id, isEditMode]);

  // ============================================
  // Local Image Upload
  // ============================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");

    // Local upload becomes the active cover image
    setCoverImage(file);
    setCoverImageUrl("");

    // Clear Unsplash metadata
    setCoverImageAuthor("");
    setCoverImageAuthorUrl("");
    setCoverImageUnsplashUrl("");

    const previewUrl = URL.createObjectURL(file);

    setCoverPreview(previewUrl);
  };

  // ============================================
  // Search Unsplash
  // ============================================

  const handleUnsplashSearch = async () => {
    const query = unsplashQuery.trim();

    if (!query) {
      setUnsplashError("Please enter something to search.");
      return;
    }

    try {
      setUnsplashLoading(true);
      setUnsplashError("");

      const response = await api.get("/unsplash/search", {
        params: {
          query,
          page: 1,
          perPage: 12,
        },
      });

      setUnsplashPhotos(response.data.photos || []);
    } catch (error) {
      console.error("Unsplash search error:", error);

      setUnsplashPhotos([]);

      setUnsplashError(
        error.response?.data?.message || "Failed to search Unsplash photos.",
      );
    } finally {
      setUnsplashLoading(false);
    }
  };

  // ============================================
  // Select Unsplash Image
  // ============================================

  const handleSelectUnsplashPhoto = async (photo) => {
    if (!photo?.imageUrl) {
      return;
    }

    /*
     * Unsplash requires the download_location endpoint
     * to be triggered when a user chooses a photo to
     * include in a blog post.
     *
     * We intentionally don't block the UI if tracking fails.
     */
    if (photo.downloadLocation) {
      api
        .get("/unsplash/download", {
          params: {
            url: photo.downloadLocation,
          },
        })
        .catch((error) => {
          console.error("Unsplash download tracking error:", error);
        });
    }

    // Unsplash becomes the active cover image
    setCoverImage(null);
    setCoverImageUrl(photo.imageUrl);
    setCoverPreview(photo.imageUrl);

    // Attribution data
    setCoverImageAuthor(photo.photographer || "");

    setCoverImageAuthorUrl(photo.photographerUrl || "");

    setCoverImageUnsplashUrl(photo.unsplashUrl || "");

    setError("");
    setUnsplashError("");
    setUnsplashOpen(false);
  };

  // ============================================
  // Remove Cover Image
  // ============================================

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverPreview("");

    setCoverImageUrl("");

    setCoverImageAuthor("");
    setCoverImageAuthorUrl("");
    setCoverImageUnsplashUrl("");
  };

  // ============================================
  // Submit Post
  // ============================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);

      // ==========================================
      // Tags
      // ==========================================

      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      formData.append("tags", JSON.stringify(tagArray));

      // ==========================================
      // Local Uploaded Image
      // ==========================================

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      // ==========================================
      // Unsplash Image
      // ==========================================

      if (!coverImage && coverImageUrl) {
        formData.append("coverImageUrl", coverImageUrl);

        formData.append("coverImageAuthor", coverImageAuthor);

        formData.append("coverImageAuthorUrl", coverImageAuthorUrl);

        formData.append("coverImageUnsplashUrl", coverImageUnsplashUrl);
      }

      // ==========================================
      // Edit Existing Post
      // ==========================================

      if (isEditMode) {
        const response = await api.put(`/posts/${id}`, formData);

        setMessage(response.data.message || "Post updated successfully.");

        if (response.data.post?.status === "published") {
          navigate(`/post/${response.data.post.slug}`);
        } else {
          navigate("/dashboard");
        }

        return;
      }

      // ==========================================
      // Create New Post
      // ==========================================

      const response = await api.post("/posts", formData);

      setMessage(response.data.message || "Post created successfully.");

      if (response.data.post?.status === "published") {
        navigate(`/post/${response.data.post.slug}`);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Save post error:", error);

      setError(error.response?.data?.message || "Failed to save post.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Loading
  // ============================================

  if (fetching) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

            <p className="text-sm text-zinc-400">Loading post...</p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* ====================================== */}
        {/* Header */}
        {/* ====================================== */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-zinc-500">
            {isEditMode ? "Editor" : "New Article"}
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isEditMode ? "Edit your post" : "Create a new post"}
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            {isEditMode
              ? "Update your article and publish your latest changes."
              : "Write something useful and share it with the developer community."}
          </p>
        </div>

        {/* ====================================== */}
        {/* Error */}
        {/* ====================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ====================================== */}
        {/* Success */}
        {/* ====================================== */}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {/* ====================================== */}
        {/* Form */}
        {/* ====================================== */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* ================================== */}
            {/* Article Details */}
            {/* ================================== */}

            <Card className="border-white/[0.08] bg-[#0d0f12] text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Article details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Title
                  </label>

                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter an interesting title..."
                    required
                    className="h-12 border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label
                    htmlFor="tags"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Tags
                  </label>

                  <Input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="react, javascript, mongodb"
                    className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />

                  <p className="text-xs text-zinc-500">
                    Separate multiple tags with commas.
                  </p>
                </div>

                {/* ================================= */}
                {/* Cover Image */}
                {/* ================================= */}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-200">
                      Cover Image
                    </label>

                    <p className="mt-1 text-xs text-zinc-500">
                      Upload your own image or choose one from Unsplash.
                    </p>
                  </div>

                  {/* Image Options */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Local Upload */}
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
                          <ImageIcon className="h-4 w-4 text-zinc-300" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            Upload image
                          </p>

                          <p className="text-xs text-zinc-500">
                            JPG, PNG or WEBP
                          </p>
                        </div>
                      </div>

                      <Input
                        id="coverImage"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="h-auto cursor-pointer border-white/10 bg-white/[0.04] py-3 text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black hover:bg-white/[0.06]"
                      />
                    </div>

                    {/* Unsplash */}
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
                          <Search className="h-4 w-4 text-zinc-300" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-zinc-200">
                            Unsplash
                          </p>

                          <p className="text-xs text-zinc-500">
                            Choose a beautiful photo
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setUnsplashOpen(true);
                          setUnsplashError("");
                        }}
                        className="w-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Choose from Unsplash
                      </Button>
                    </div>
                  </div>

                  {/* Current Preview */}
                  {coverPreview && (
                    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black">
                      <div className="relative">
                        <img
                          src={coverPreview}
                          alt="Cover Preview"
                          className="h-64 w-full object-cover"
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="absolute right-3 top-3"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      {/* Unsplash Attribution */}
                      {coverImageUrl && coverImageAuthor && (
                        <div className="border-t border-white/[0.08] px-4 py-3">
                          <p className="text-xs text-zinc-500">
                            Photo by{" "}
                            {coverImageAuthorUrl ? (
                              <a
                                href={`${coverImageAuthorUrl}?utm_source=coderbari&utm_medium=referral`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-zinc-300 underline underline-offset-2 hover:text-white"
                              >
                                {coverImageAuthor}
                              </a>
                            ) : (
                              <span className="text-zinc-300">
                                {coverImageAuthor}
                              </span>
                            )}{" "}
                            on{" "}
                            <a
                              href={
                                coverImageUnsplashUrl
                                  ? `${coverImageUnsplashUrl}?utm_source=coderbari&utm_medium=referral`
                                  : "https://unsplash.com/?utm_source=coderbari&utm_medium=referral"
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-300 underline underline-offset-2 hover:text-white"
                            >
                              Unsplash
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ================================== */}
            {/* Content */}
            {/* ================================== */}

            <Card className="border-white/[0.08] bg-[#0d0f12] text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Content</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#08090b]">
                  <MarkdownEditor value={content} onChange={setContent} />
                </div>
              </CardContent>
            </Card>

            {/* ================================== */}
            {/* Publishing */}
            {/* ================================== */}

            <Card className="border-white/[0.08] bg-[#0d0f12] text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10 sm:w-64"
                  >
                    <option value="draft" className="bg-[#0d0f12]">
                      Draft
                    </option>

                    <option value="published" className="bg-[#0d0f12]">
                      Published
                    </option>
                  </select>

                  <p className="text-xs text-zinc-500">
                    Save as a draft or publish your article immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ================================== */}
            {/* Actions */}
            {/* ================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-white/10 bg-transparent text-white hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-white font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                    ? "Update Post"
                    : "Create Post"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* ======================================== */}
      {/* Unsplash Dialog */}
      {/* ======================================== */}

      <Dialog open={unsplashOpen} onOpenChange={setUnsplashOpen}>
        <DialogContent className="max-w-5xl border-white/10 bg-[#0d0f12] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Choose a cover image</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="flex gap-2">
            <Input
              value={unsplashQuery}
              onChange={(event) => setUnsplashQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleUnsplashSearch();
                }
              }}
              placeholder="Search React, JavaScript, MongoDB..."
              className="border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600"
            />

            <Button
              type="button"
              onClick={handleUnsplashSearch}
              disabled={unsplashLoading}
              className="shrink-0"
            >
              <Search className="mr-2 h-4 w-4" />

              {unsplashLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Error */}
          {unsplashError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {unsplashError}
            </div>
          )}

          {/* Photo Grid */}
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            {/* Loading */}
            {unsplashLoading && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[4/3] animate-pulse rounded-xl bg-white/[0.05]"
                  />
                ))}
              </div>
            )}

            {/* Photos */}
            {!unsplashLoading && unsplashPhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {unsplashPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.photographer || "Unsplash photo"}
                        className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-3">
                      <p className="truncate text-xs text-zinc-400">
                        Photo by {photo.photographer}
                      </p>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSelectUnsplashPhoto(photo)}
                        className="mt-3 w-full"
                      >
                        Use this image
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!unsplashLoading &&
              unsplashPhotos.length === 0 &&
              !unsplashError && (
                <div className="py-16 text-center">
                  <Search className="mx-auto mb-3 h-8 w-8 text-zinc-600" />

                  <p className="text-sm text-zinc-400">
                    Search Unsplash for a cover image
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Try searching for React, coding, technology, JavaScript,
                    etc.
                  </p>
                </div>
              )}
          </div>

          {/* Attribution note */}
          <p className="text-xs text-zinc-600">
            Images provided by Unsplash. Photographer attribution is shown when
            an image is selected.
          </p>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PostEditor;
