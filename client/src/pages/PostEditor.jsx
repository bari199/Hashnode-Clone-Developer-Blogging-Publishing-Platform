import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Image as ImageIcon,
  Search,
  Sparkles,
  Upload,
  X,
  Loader2,
} from "lucide-react";

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
  DialogDescription,
} from "@/components/ui/dialog";

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // =========================================================
  // BASIC POST STATES
  // =========================================================

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");

  // =========================================================
  // COVER IMAGE STATES
  // =========================================================

  // local | unsplash | ai
  const [coverImageSource, setCoverImageSource] = useState("");

  // Local image
  const [coverImage, setCoverImage] = useState(null);

  // Preview
  const [coverPreview, setCoverPreview] = useState("");

  // Unsplash
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageAuthor, setCoverImageAuthor] = useState("");
  const [coverImageAuthorUrl, setCoverImageAuthorUrl] = useState("");
  const [coverImageUnsplashUrl, setCoverImageUnsplashUrl] = useState("");

  // AI generated image
  const [aiImageUrl, setAiImageUrl] = useState("");

  // =========================================================
  // GENERAL STATES
  // =========================================================

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // UNSPLASH STATES
  // =========================================================

  const [unsplashOpen, setUnsplashOpen] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashPhotos, setUnsplashPhotos] = useState([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashError, setUnsplashError] = useState("");

  // =========================================================
  // AI IMAGE STATES
  // =========================================================

  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  // =========================================================
  // AI WRITING STATES
  // =========================================================

  const [aiLoading, setAiLoading] = useState({
    title: false,
    tags: false,
    content: false,
    excerpt: false,
    cover: false,
  });

  const setAiLoadingState = (key, value) => {
    setAiLoading((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================================================
  // LOAD EXISTING POST
  // =========================================================

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadPost = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await api.get("/posts/mine");

        const existingPost = response.data.posts?.find(
          (post) => post._id === id,
        );

        if (!existingPost) {
          setError("Post not found.");
          return;
        }

        // Basic information
        setTitle(existingPost.title || "");
        setContent(existingPost.content || "");
        setExcerpt(existingPost.excerpt || "");
        setStatus(existingPost.status || "draft");

        // Tags
        if (existingPost.tags?.length > 0) {
          setTags(
            existingPost.tags
              .map((tag) => tag.name)
              .filter(Boolean)
              .join(", "),
          );
        }

        // Existing local cover image
        if (existingPost.coverImage) {
          setCoverPreview(existingPost.coverImage);
          setCoverImageSource("local");
        }

        // Existing Unsplash image
        if (existingPost.coverImageUrl) {
          setCoverImageUrl(existingPost.coverImageUrl);
          setCoverPreview(existingPost.coverImageUrl);

          if (existingPost.coverImageSource === "ai") {
            setCoverImageSource("ai");
            setAiImageUrl(existingPost.coverImageUrl);
          } else {
            setCoverImageSource("unsplash");

            setCoverImageAuthor(existingPost.coverImageAuthor || "");

            setCoverImageAuthorUrl(existingPost.coverImageAuthorUrl || "");

            setCoverImageUnsplashUrl(existingPost.coverImageUnsplashUrl || "");
          }
        }
      } catch (error) {
        console.error("Load post error:", error);

        setError(error.response?.data?.message || "Failed to load post.");
      } finally {
        setFetching(false);
      }
    };

    loadPost();
  }, [id, isEditMode]);

  // =========================================================
  // SELECT LOCAL IMAGE
  // =========================================================

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

    setCoverImageSource("local");
    setCoverImage(file);

    // Clear Unsplash
    setCoverImageUrl("");
    setCoverImageAuthor("");
    setCoverImageAuthorUrl("");
    setCoverImageUnsplashUrl("");

    // Clear AI
    setAiImageUrl("");

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  };

  // =========================================================
  // REMOVE COVER IMAGE
  // =========================================================

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverPreview("");
    setCoverImageSource("");

    setCoverImageUrl("");
    setCoverImageAuthor("");
    setCoverImageAuthorUrl("");
    setCoverImageUnsplashUrl("");

    setAiImageUrl("");
  };

  // =========================================================
  // SELECT LOCAL IMAGE MODE
  // =========================================================

  const handleSelectLocal = () => {
    setCoverImageSource("local");

    setCoverImageUrl("");
    setCoverImageAuthor("");
    setCoverImageAuthorUrl("");
    setCoverImageUnsplashUrl("");

    setAiImageUrl("");

    if (!coverImage) {
      setCoverPreview("");
    }
  };

  // =========================================================
  // OPEN UNSPLASH
  // =========================================================

  const handleOpenUnsplash = () => {
    setUnsplashOpen(true);

    setUnsplashError("");
    setUnsplashQuery("");
    setUnsplashPhotos([]);
  };

  // =========================================================
  // SEARCH UNSPLASH
  // =========================================================

  const handleUnsplashSearch = async (event) => {
    event?.preventDefault();

    if (!unsplashQuery.trim()) {
      setUnsplashError("Please enter a search term.");
      return;
    }

    try {
      setUnsplashLoading(true);
      setUnsplashError("");

      const response = await api.get("/unsplash/search", {
        params: {
          query: unsplashQuery.trim(),
          page: 1,
          perPage: 12,
        },
      });

      setUnsplashPhotos(response.data.photos || []);
    } catch (error) {
      console.error("Unsplash search error:", error);

      setUnsplashError(
        error.response?.data?.message || "Failed to search Unsplash.",
      );
    } finally {
      setUnsplashLoading(false);
    }
  };

  // =========================================================
  // SELECT UNSPLASH IMAGE
  // =========================================================

  const handleSelectUnsplashImage = async (photo) => {
    try {
      setError("");

      // Unsplash download tracking
      if (photo.downloadLocation) {
        try {
          await api.get("/unsplash/download", {
            params: {
              url: photo.downloadLocation,
            },
          });
        } catch (downloadError) {
          console.error("Unsplash download tracking error:", downloadError);
        }
      }

      // Set Unsplash as active source
      setCoverImageSource("unsplash");

      // Clear local image
      setCoverImage(null);

      // Clear AI image
      setAiImageUrl("");

      // Store Unsplash information
      setCoverImageUrl(photo.imageUrl || "");
      setCoverImageAuthor(photo.photographer || "");
      setCoverImageAuthorUrl(photo.photographerUrl || "");
      setCoverImageUnsplashUrl(photo.unsplashUrl || "");

      // Preview
      setCoverPreview(photo.imageUrl || "");

      // Close dialog
      setUnsplashOpen(false);
    } catch (error) {
      console.error("Select Unsplash image error:", error);

      setError("Failed to select Unsplash image.");
    }
  };

  // =========================================================
  // OPEN AI IMAGE GENERATOR
  // =========================================================

  const handleOpenAI = () => {
    setAiOpen(true);
    setAiError("");

    if (!aiPrompt.trim() && title.trim()) {
      setAiPrompt(
        `Create a professional developer blog cover image about ${title}`,
      );
    }
  };

  // =========================================================
  // GENERATE AI IMAGE
  // =========================================================

  const handleGenerateAIImage = async () => {
    if (!aiPrompt.trim()) {
      setAiError("Please describe the image you want.");
      return;
    }

    try {
      setAiGenerating(true);
      setAiError("");

      const response = await api.post("/ai/generate-cover", {
        prompt: aiPrompt.trim(),
      });

      const imageUrl = response.data?.image?.url;

      if (!imageUrl) {
        throw new Error("AI image URL was not returned.");
      }

      // AI becomes active source
      setCoverImageSource("ai");

      // Clear local
      setCoverImage(null);

      // Clear Unsplash
      setCoverImageUrl("");
      setCoverImageAuthor("");
      setCoverImageAuthorUrl("");
      setCoverImageUnsplashUrl("");

      // Store AI image
      setAiImageUrl(imageUrl);

      // Preview
      setCoverPreview(imageUrl);

      // Close dialog
      setAiOpen(false);
    } catch (error) {
      console.error("AI image generation error:", error);

      setAiError(
        error.response?.data?.message || "Failed to generate AI image.",
      );
    } finally {
      setAiGenerating(false);
    }
  };

  // =========================================================
  // AI GENERATE TITLE
  // =========================================================

  const handleGenerateTitle = async () => {
    if (!title.trim()) {
      setError("Please enter a topic first.");
      return;
    }

    try {
      setAiLoadingState("title", true);
      setError("");

      const response = await api.post("/ai/generate-title", {
        topic: title.trim(),
      });

      setTitle(response.data.title || "");
    } catch (error) {
      console.error("Generate title error:", error);

      setError(error.response?.data?.message || "Failed to generate title.");
    } finally {
      setAiLoadingState("title", false);
    }
  };

  // =========================================================
  // AI GENERATE TAGS
  // =========================================================

  const handleGenerateTags = async () => {
    if (!title.trim()) {
      setError("Please enter a title first.");
      return;
    }

    try {
      setAiLoadingState("tags", true);
      setError("");

      const response = await api.post("/ai/generate-tags", {
        title: title.trim(),
        content: content.trim(),
      });

      const generatedTags = response.data.tags;

      if (Array.isArray(generatedTags)) {
        setTags(generatedTags.join(", "));
      } else {
        setTags(generatedTags || "");
      }
    } catch (error) {
      console.error("Generate tags error:", error);

      setError(error.response?.data?.message || "Failed to generate tags.");
    } finally {
      setAiLoadingState("tags", false);
    }
  };

  // =========================================================
  // AI GENERATE CONTENT
  // =========================================================

  const handleGenerateContent = async () => {
    if (!title.trim()) {
      setError("Please enter a title first.");
      return;
    }

    try {
      setAiLoadingState("content", true);
      setError("");

      const response = await api.post("/ai/generate-content", {
        title: title.trim(),
        tags: tags.trim(),
        topic: title.trim(),
      });

      setContent(response.data.content || "");
    } catch (error) {
      console.error("Generate content error:", error);

      setError(error.response?.data?.message || "Failed to generate content.");
    } finally {
      setAiLoadingState("content", false);
    }
  };

  // =========================================================
  // AI GENERATE EXCERPT
  // =========================================================

  const handleGenerateExcerpt = async () => {
    if (!title.trim()) {
      setError("Please enter a title first.");
      return;
    }

    if (!content.trim()) {
      setError("Please generate or write content first.");
      return;
    }

    try {
      setAiLoadingState("excerpt", true);
      setError("");

      const response = await api.post("/ai/generate-excerpt", {
        title: title.trim(),
        content: content.trim(),
      });

      setExcerpt(response.data.excerpt || "");
    } catch (error) {
      console.error("Generate excerpt error:", error);

      setError(error.response?.data?.message || "Failed to generate excerpt.");
    } finally {
      setAiLoadingState("excerpt", false);
    }
  };

  // =========================================================
  // SUBMIT POST
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    // Validation
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

      // Basic post data
      formData.append("title", title.trim());
      formData.append("content", content);
      formData.append("excerpt", excerpt.trim());
      formData.append("status", status);

      // Tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      formData.append("tags", JSON.stringify(tagArray));

      // =====================================================
      // LOCAL COVER IMAGE
      // =====================================================

      if (coverImageSource === "local" && coverImage) {
        formData.append("coverImage", coverImage);
      }

      // =====================================================
      // UNSPLASH COVER IMAGE
      // =====================================================

      if (coverImageSource === "unsplash" && coverImageUrl) {
        formData.append("coverImageUrl", coverImageUrl);

        formData.append("coverImageAuthor", coverImageAuthor);

        formData.append("coverImageAuthorUrl", coverImageAuthorUrl);

        formData.append("coverImageUnsplashUrl", coverImageUnsplashUrl);
      }

      // =====================================================
      // AI COVER IMAGE
      // =====================================================

      if (coverImageSource === "ai" && aiImageUrl) {
        formData.append("coverImageUrl", aiImageUrl);

        formData.append("coverImageSource", "ai");
      }

      // =====================================================
      // UPDATE POST
      // =====================================================

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

      // =====================================================
      // CREATE POST
      // =====================================================

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

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (fetching) {
    return (
      <main className="min-h-screen bg-white text-gray-900 dark:bg-[#08090b] dark:text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-gray-900 dark:border-white/20 dark:border-t-white" />

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading post...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-[#08090b] dark:text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-zinc-500">
            {isEditMode ? "Editor" : "New Article"}
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isEditMode ? "Edit your post" : "Create a new post"}
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {isEditMode
              ? "Update your article and publish your latest changes."
              : "Write something useful and share it with the developer community."}
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 dark:text-red-300/70 hover:text-red-700 dark:hover:text-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            {message}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* =================================================
                ARTICLE DETAILS
            ================================================= */}

            <Card className="border-black/[0.08] bg-gray-50 text-gray-900 shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f12] dark:text-white">
              <CardHeader>
                <CardTitle className="text-lg">Article details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* TITLE */}

                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
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
                    className="h-12 border-black/10 bg-black/[0.04] text-gray-900 placeholder:text-zinc-400 focus-visible:ring-black/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-zinc-600 dark:focus-visible:ring-white/20"
                  />
                </div>

                {/* TAGS */}

                <div className="space-y-2">
                  <label
                    htmlFor="tags"
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    Tags
                  </label>

                  <Input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="react, javascript, mongodb"
                    className="h-11 border-black/10 bg-black/[0.04] text-gray-900 placeholder:text-zinc-400 focus-visible:ring-black/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-zinc-600 dark:focus-visible:ring-white/20"
                  />

                  <p className="text-xs text-zinc-500">
                    Separate multiple tags with commas.
                  </p>
                </div>

                {/* EXCERPT */}

                <div className="space-y-2">
                  <label
                    htmlFor="excerpt"
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    Excerpt
                  </label>

                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    placeholder="Write a short description of your article..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-black/10 bg-black/[0.04] px-3 py-3 text-sm text-gray-900 outline-none placeholder:text-zinc-400 focus:border-black/20 focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white/20 dark:focus:ring-white/10"
                  />

                  <p className="text-xs text-zinc-500">
                    A short summary of your article.
                  </p>
                </div>

                {/* =================================================
                    COVER IMAGE
                ================================================= */}

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      Cover Image
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Choose an image source for your article.
                    </p>
                  </div>

                  {/* IMAGE OPTIONS */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* LOCAL */}

                    <button
                      type="button"
                      onClick={handleSelectLocal}
                      className={`group rounded-xl border p-4 text-left transition ${
                        coverImageSource === "local"
                          ? "border-black/30 bg-black/[0.08] dark:border-white/30 dark:bg-white/[0.08]"
                          : "border-black/[0.08] bg-black/[0.02] hover:border-black/20 hover:bg-black/[0.05] dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-black/[0.08] dark:bg-white/[0.08]">
                        <Upload className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
                      </div>

                      <p className="text-sm font-semibold">Local Image</p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Upload from your computer.
                      </p>
                    </button>

                    {/* UNSPLASH */}

                    <button
                      type="button"
                      onClick={handleOpenUnsplash}
                      className={`group rounded-xl border p-4 text-left transition ${
                        coverImageSource === "unsplash"
                          ? "border-black/30 bg-black/[0.08] dark:border-white/30 dark:bg-white/[0.08]"
                          : "border-black/[0.08] bg-black/[0.02] hover:border-black/20 hover:bg-black/[0.05] dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-black/[0.08] dark:bg-white/[0.08]">
                        <ImageIcon className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
                      </div>

                      <p className="text-sm font-semibold">Unsplash</p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Search free photos.
                      </p>
                    </button>

                    {/* AI */}

                    <button
                      type="button"
                      onClick={handleOpenAI}
                      className={`group rounded-xl border p-4 text-left transition ${
                        coverImageSource === "ai"
                          ? "border-black/30 bg-black/[0.08] dark:border-white/30 dark:bg-white/[0.08]"
                          : "border-black/[0.08] bg-black/[0.02] hover:border-black/20 hover:bg-black/[0.05] dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-black/[0.08] dark:bg-white/[0.08]">
                        <Sparkles className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
                      </div>

                      <p className="text-sm font-semibold">AI Generate</p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Create a custom cover with AI.
                      </p>
                    </button>
                  </div>

                  {/* LOCAL UPLOAD */}

                  {coverImageSource === "local" && (
                    <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4 dark:border-white/[0.08] dark:bg-white/[0.02]">
                      <Input
                        id="coverImage"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="h-auto cursor-pointer border-black/10 bg-black/[0.04] py-3 text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:file:bg-white dark:file:text-black dark:hover:bg-white/[0.06]"
                      />

                      <p className="mt-2 text-xs text-zinc-500">
                        JPG, JPEG, PNG or WEBP · Maximum 5MB
                      </p>
                    </div>
                  )}

                  {/* COVER PREVIEW */}

                  {coverPreview && (
                    <div className="relative overflow-hidden rounded-xl border border-black/[0.08] bg-black dark:border-white/[0.08]">
                      <img
                        src={coverPreview}
                        alt="Cover Preview"
                        className="h-72 w-full object-cover"
                      />

                      <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                        {coverImageSource === "local" && "Local Image"}

                        {coverImageSource === "unsplash" && "Unsplash"}

                        {coverImageSource === "ai" && "✨ AI Generated"}
                      </div>

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
                  )}

                  {/* UNSPLASH ATTRIBUTION */}

                  {coverImageSource === "unsplash" && coverImageAuthor && (
                    <p className="text-xs text-zinc-500">
                      Photo by{" "}
                      <a
                        href={coverImageAuthorUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-700 underline underline-offset-2 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-white"
                      >
                        {coverImageAuthor}
                      </a>{" "}
                      on{" "}
                      <a
                        href={coverImageUnsplashUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-700 underline underline-offset-2 hover:text-gray-900 dark:text-zinc-300 dark:hover:text-white"
                      >
                        Unsplash
                      </a>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                AI WRITING ASSISTANT
            ================================================= */}

            <Card className="border-black/[0.08] bg-gray-50 text-gray-900 shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f12] dark:text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5" />
                  AI Writing Assistant
                </CardTitle>

                <p className="text-sm text-zinc-500">
                  Generate and improve your blog content with AI.
                </p>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {/* TITLE */}

                  <Button
                    type="button"
                    onClick={handleGenerateTitle}
                    disabled={aiLoading.title}
                    className="
                      border-0
                      bg-gradient-to-r from-indigo-400 to-cyan-400
                      from-violet-500
                      via-purple-500
                      to-pink-500
                      text-white
                      shadow-md
                      shadow-purple-500/20
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:from-violet-600
                      hover:via-purple-600
                      hover:to-pink-600
                      hover:shadow-lg
                      hover:shadow-purple-500/30
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {aiLoading.title ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Title
                      </>
                    )}
                  </Button>

                  {/* TAGS */}

                  <Button
                    type="button"
                    onClick={handleGenerateTags}
                    disabled={aiLoading.tags}
                    className="
                      border-0
                      bg-gradient-to-r
                      from-violet-500
                      via-purple-500
                      to-pink-500
                      text-white
                      shadow-md
                      shadow-purple-500/20
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:from-violet-600
                      hover:via-purple-600
                      hover:to-pink-600
                      hover:shadow-lg
                      hover:shadow-purple-500/30
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {aiLoading.tags ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "🏷️ Tags"
                    )}
                  </Button>

                  {/* CONTENT */}

                  <Button
                    type="button"
                    onClick={handleGenerateContent}
                    disabled={aiLoading.content}
                    className="
                      border-0
                      bg-gradient-to-r
                      from-violet-500
                      via-purple-500
                      to-pink-500
                      text-white
                      shadow-md
                      shadow-purple-500/20
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:from-violet-600
                      hover:via-purple-600
                      hover:to-pink-600
                      hover:shadow-lg
                      hover:shadow-purple-500/30
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {aiLoading.content ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "✍️ Content"
                    )}
                  </Button>

                  {/* EXCERPT */}

                  <Button
                    type="button"
                    onClick={handleGenerateExcerpt}
                    disabled={aiLoading.excerpt}
                    className="
                      border-0
                      bg-gradient-to-r
                      from-violet-900
                      via-purple-500
                      to-pink-500
                      text-white
                      shadow-md
                      shadow-purple-500/20
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:from-violet-600
                      hover:via-purple-600
                      hover:to-pink-600
                      hover:shadow-lg
                      hover:shadow-purple-500/30
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {aiLoading.excerpt ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "📝 Excerpt"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                CONTENT
            ================================================= */}

            <Card className="border-black/[0.08] bg-gray-50 text-gray-900 shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f12] dark:text-white">
              <CardHeader>
                <CardTitle className="text-lg">Content</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#08090b]">
                  <MarkdownEditor value={content} onChange={setContent} />
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                PUBLISHING
            ================================================= */}

            <Card className="border-black/[0.08] bg-gray-50 text-gray-900 shadow-2xl dark:border-white/[0.08] dark:bg-[#0d0f12] dark:text-white">
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-11 w-full rounded-md border border-black/10 bg-black/[0.04] px-3 text-sm text-gray-900 outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-white/20 dark:focus:ring-white/10 sm:w-64"
                  >
                    <option
                      value="draft"
                      className="bg-gray-50 dark:bg-[#0d0f12]"
                    >
                      Draft
                    </option>

                    <option
                      value="published"
                      className="bg-gray-50 dark:bg-[#0d0f12]"
                    >
                      Published
                    </option>
                  </select>

                  <p className="text-xs text-zinc-500">
                    Save as a draft or publish your article immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-black/[0.08] pt-6 dark:border-white/[0.08] sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-black/10 bg-transparent text-gray-900 hover:bg-black/[0.08] hover:text-gray-900 dark:border-white/10 dark:text-white dark:hover:bg-white/[0.08] dark:hover:text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-gray-900 font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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

      {/* =======================================================
          UNSPLASH DIALOG
      ======================================================= */}

      <Dialog open={unsplashOpen} onOpenChange={setUnsplashOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden border-black/10 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#0d0f12] dark:text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Search Unsplash
            </DialogTitle>

            <DialogDescription className="text-zinc-500">
              Search for a cover image for your article.
            </DialogDescription>
          </DialogHeader>

          {/* SEARCH */}

          <form onSubmit={handleUnsplashSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <Input
                value={unsplashQuery}
                onChange={(event) => setUnsplashQuery(event.target.value)}
                placeholder="Search developer, coding, technology..."
                className="h-11 border-black/10 bg-black/[0.04] pl-9 text-gray-900 placeholder:text-zinc-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-zinc-600"
              />
            </div>

            <Button
              type="submit"
              disabled={unsplashLoading}
              className="bg-gray-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {unsplashLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </form>

          {/* ERROR */}

          {unsplashError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
              {unsplashError}
            </div>
          )}

          {/* RESULTS */}

          <div className="max-h-[55vh] overflow-y-auto pr-2">
            {unsplashPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {unsplashPhotos.map((photo) => (
                  <button
                    type="button"
                    key={photo.id}
                    onClick={() => handleSelectUnsplashImage(photo)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-black/[0.08] bg-black dark:border-white/[0.08]"
                  >
                    <img
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt={photo.photographer || "Unsplash photo"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8 text-left opacity-0 transition group-hover:opacity-100">
                      <p className="truncate text-xs text-white">
                        {photo.photographer}
                      </p>

                      <p className="mt-1 text-[10px] text-zinc-400">
                        Select image
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-48 items-center justify-center text-center">
                <div>
                  <Search className="mx-auto mb-3 h-8 w-8 text-zinc-700" />

                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Search for an image
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Try: coding, programming, technology, developer
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* =======================================================
          AI IMAGE DIALOG
      ======================================================= */}

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="max-w-xl border-black/10 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-[#0d0f12] dark:text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate AI Cover
            </DialogTitle>

            <DialogDescription className="text-zinc-500">
              Describe the image you want and AI will create a cover for your
              article.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* PROMPT */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Image description
              </label>

              <textarea
                value={aiPrompt}
                onChange={(event) => setAiPrompt(event.target.value)}
                placeholder="A modern developer working with React and Node.js in a futuristic workspace, dark cinematic lighting, professional technology blog cover..."
                rows={6}
                className="w-full resize-none rounded-lg border border-black/10 bg-black/[0.04] px-3 py-3 text-sm text-gray-900 outline-none placeholder:text-zinc-400 focus:border-black/20 focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white/20 dark:focus:ring-white/10"
              />

              <p className="text-xs text-zinc-600">
                Describe the subject, style, mood and visual elements you want.
              </p>
            </div>

            {/* ERROR */}

            {aiError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                {aiError}
              </div>
            )}

            {/* BUTTONS */}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAiOpen(false)}
                disabled={aiGenerating}
                className="border-black/10 bg-transparent text-gray-900 hover:bg-black/[0.08] hover:text-gray-900 dark:border-white/10 dark:text-white dark:hover:bg-white/[0.08] dark:hover:text-white"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleGenerateAIImage}
                disabled={aiGenerating}
                className="bg-gradient-to-r from-violet-700 via-purple-900 to-pink-500 font-semibold text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PostEditor;
