import handlePostTags from "../utils/handlePostTags.js";
import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import TagFollow from "../models/TagFollow.js";
import { createNotification } from "../services/notification/notificationService.js";

/* =========================================================
   HELPER: GENERATE SLUG
========================================================= */

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/* =========================================================
   HELPER: UPLOAD BUFFER TO CLOUDINARY
========================================================= */

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "hashnode/posts",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
};

/* =========================================================
   CREATE POST
========================================================= */

export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      tags,
      status,
      coverImageSource,
      coverImageUrl,
      coverImageAuthor,
      coverImageAuthorUrl,
      coverImageUnsplashUrl,
    } = req.body;

    /* Validate input */

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    /* Validate status */

    const postStatus = status || "draft";

    if (!["draft", "published"].includes(postStatus)) {
      return res.status(400).json({
        message: "Status must be draft or published",
      });
    }

    /* Generate slug */

    const slug = generateSlug(title);

    if (!slug) {
      return res.status(400).json({
        message: "Please provide a valid title",
      });
    }

    /* Handle tags */

    const tagIds = await handlePostTags(tags);
    console.log("RAW TAGS:", tags);
    console.log("TAG IDS:", tagIds);
    /* Cover image variables */

    let finalCoverImage = "";
    let finalCoverImageUrl = "";
    let finalCoverImageAuthor = "";
    let finalCoverImageAuthorUrl = "";
    let finalCoverImageUnsplashUrl = "";
    let finalCoverImageSource = "";

    /* 1. Local uploaded image */

    if (req.file?.buffer) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);

      finalCoverImage = uploadResult.secure_url;
      finalCoverImageSource = "local";
    } else if (coverImageSource === "ai" && coverImageUrl) {
      /* 2. AI-generated image */
      finalCoverImage = coverImageUrl;
      finalCoverImageSource = "ai";
    } else if (coverImageUrl) {
      /* 3. Unsplash image */
      finalCoverImage = coverImageUrl;
      finalCoverImageUrl = coverImageUrl;

      finalCoverImageAuthor = coverImageAuthor || "";
      finalCoverImageAuthorUrl = coverImageAuthorUrl || "";
      finalCoverImageUnsplashUrl = coverImageUnsplashUrl || "";

      finalCoverImageSource = "unsplash";
    }

    /* Create post */

    const post = await Post.create({
      title: title.trim(),
      slug,
      content,

      coverImage: finalCoverImage,
      coverImageUrl: finalCoverImageUrl,
      coverImageAuthor: finalCoverImageAuthor,
      coverImageAuthorUrl: finalCoverImageAuthorUrl,
      coverImageUnsplashUrl: finalCoverImageUnsplashUrl,
      coverImageSource: finalCoverImageSource,

      status: postStatus,
      author: req.user._id,
      tags: tagIds,
    });

    /* Notify users who follow these tags */
    console.log("TAG IDS:", tagIds);
    if (post.status === "published" && tagIds.length > 0) {
      const tagFollows = await TagFollow.find({
        tag: { $in: tagIds },
        user: { $ne: req.user._id },
      }).select("user tag");
      console.log("TAG FOLLOWERS:", tagFollows);
      /* Avoid notifying the same user multiple times */

      const uniqueRecipients = new Map();

      for (const follow of tagFollows) {
        const userId = follow.user.toString();

        if (!uniqueRecipients.has(userId)) {
          uniqueRecipients.set(userId, follow.tag);
        }
      }
      console.log("UNIQUE RECIPIENTS:", uniqueRecipients);
      for (const [recipientId, tagId] of uniqueRecipients) {
        await createNotification({
          recipient: recipientId,
          sender: req.user._id,
          type: "follow_tag",
          post: post._id,
          tag: tagId,
          message: "published a new post in a tag you follow",
        });
      }
    }

    /* Return response */

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

/* =========================================================
   GET PUBLISHED POSTS
========================================================= */

export const getPublishedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "published",
    })
      .populate("author", "name username avatarUrl")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get published posts error:", error);

    return res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

/* =========================================================
   GET POST BY SLUG
========================================================= */

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({
      slug,
      status: "published",
    })
      .populate("author", "name username bio avatarUrl")
      .populate("tags", "name slug");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      post,
    });
  } catch (error) {
    console.error("Get post by slug error:", error);

    return res.status(500).json({
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

/* =========================================================
   GET MY POSTS
========================================================= */

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user._id,
    })
      .populate("author", "name username avatarUrl")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get my posts error:", error);

    return res.status(500).json({
      message: "Failed to fetch your posts",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE POST
========================================================= */

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      tags,
      status,
      coverImageSource,
      coverImageUrl,
      coverImageAuthor,
      coverImageAuthorUrl,
      coverImageUnsplashUrl,
    } = req.body;

    /* Find post */

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    /* Ownership check */

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    /* Update title and slug */

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Title cannot be empty",
        });
      }

      post.title = title.trim();
      post.slug = generateSlug(title);
    }

    /* Update content */

    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
          message: "Content cannot be empty",
        });
      }

      post.content = content;
    }

    /* Update tags */

    if (tags !== undefined) {
      post.tags = await handlePostTags(tags);
    }

    /* Update status */

    if (status !== undefined) {
      if (!["draft", "published"].includes(status)) {
        return res.status(400).json({
          message: "Status must be draft or published",
        });
      }

      post.status = status;
    }

    /* Update cover image */

    if (req.file?.buffer) {
      /* 1. Local uploaded image */

      const uploadResult = await uploadToCloudinary(req.file.buffer);

      post.coverImage = uploadResult.secure_url;
      post.coverImageSource = "local";

      /* Clear Unsplash metadata */

      post.coverImageUrl = "";
      post.coverImageAuthor = "";
      post.coverImageAuthorUrl = "";
      post.coverImageUnsplashUrl = "";
    } else if (coverImageSource === "ai" && coverImageUrl) {
      /* 2. AI-generated image */

      post.coverImage = coverImageUrl;
      post.coverImageSource = "ai";

      post.coverImageUrl = "";
      post.coverImageAuthor = "";
      post.coverImageAuthorUrl = "";
      post.coverImageUnsplashUrl = "";
    } else if (coverImageUrl && coverImageSource === "unsplash") {
      /* 3. Unsplash image */

      post.coverImage = coverImageUrl;
      post.coverImageSource = "unsplash";
      post.coverImageUrl = coverImageUrl;

      post.coverImageAuthor = coverImageAuthor || "";
      post.coverImageAuthorUrl = coverImageAuthorUrl || "";
      post.coverImageUnsplashUrl = coverImageUnsplashUrl || "";
    }

    /* Save updated post */

    await post.save();

    /* Get updated post */

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name username avatarUrl")
      .populate("tags", "name slug");

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    return res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE POST
========================================================= */

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    /* Find post */

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    /* Ownership check */

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    /* Delete post */

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
