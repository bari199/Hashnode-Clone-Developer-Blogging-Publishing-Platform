import handlePostTags from "../utils/handlePostTags.js";
import Post from "../models/Post.js";
import Tag from "../models/Tag.js";

/*
|--------------------------------------------------------------------------
| Helper: Generate Slug
|--------------------------------------------------------------------------
*/

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/*
|--------------------------------------------------------------------------
| Create Post
|--------------------------------------------------------------------------
*/

export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      tags,
      status,

      // Unsplash fields
      coverImageUrl,
      coverImageAuthor,
      coverImageAuthorUrl,
      coverImageUnsplashUrl,
    } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Slug
    |--------------------------------------------------------------------------
    */

    const slug = generateSlug(title);

    /*
    |--------------------------------------------------------------------------
    | Handle Tags
    |--------------------------------------------------------------------------
    */

    const tagIds = await handlePostTags(tags);

    /*
    |--------------------------------------------------------------------------
    | Determine Cover Image
    |--------------------------------------------------------------------------
    |
    | Priority:
    |
    | 1. Uploaded local image
    | 2. Unsplash image URL
    | 3. Empty
    |
    */

    let finalCoverImage = "";

    let finalCoverImageUrl = "";
    let finalCoverImageAuthor = "";
    let finalCoverImageAuthorUrl = "";
    let finalCoverImageUnsplashUrl = "";

    /*
    |--------------------------------------------------------------------------
    | Local Uploaded Image
    |--------------------------------------------------------------------------
    */

    if (req.file) {
      finalCoverImage = req.file.path;
    } else if (coverImageUrl) {
      /*
    |--------------------------------------------------------------------------
    | Unsplash Image
    |--------------------------------------------------------------------------
    */
      finalCoverImage = coverImageUrl;

      finalCoverImageUrl = coverImageUrl;

      finalCoverImageAuthor = coverImageAuthor || "";

      finalCoverImageAuthorUrl = coverImageAuthorUrl || "";

      finalCoverImageUnsplashUrl = coverImageUnsplashUrl || "";
    }

    /*
    |--------------------------------------------------------------------------
    | Create Post
    |--------------------------------------------------------------------------
    */

    const post = await Post.create({
      title,

      slug,

      content,

      coverImage: finalCoverImage,

      // Unsplash metadata
      coverImageUrl: finalCoverImageUrl,

      coverImageAuthor: finalCoverImageAuthor,

      coverImageAuthorUrl: finalCoverImageAuthorUrl,

      coverImageUnsplashUrl: finalCoverImageUnsplashUrl,

      status: status || "draft",

      author: req.user._id,

      tags: tagIds,
    });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

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

/*
|--------------------------------------------------------------------------
| Get Published Posts
|--------------------------------------------------------------------------
*/

export const getPublishedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "published",
    })
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug")
      .sort({
        createdAt: -1,
      });

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

/*
|--------------------------------------------------------------------------
| Get Post By Slug
|--------------------------------------------------------------------------
*/

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({
      slug,

      status: "published",
    })
      .populate("author", "name bio avatarUrl")
      .populate("tags", "name slug");

    /*
    |--------------------------------------------------------------------------
    | Post Not Found
    |--------------------------------------------------------------------------
    */

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

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

/*
|--------------------------------------------------------------------------
| Get My Posts
|--------------------------------------------------------------------------
*/

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user._id,
    })
      .populate("tags", "name slug")
      .sort({
        createdAt: -1,
      });

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

/*
|--------------------------------------------------------------------------
| Update Post
|--------------------------------------------------------------------------
*/

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      tags,
      status,

      // Unsplash fields
      coverImageUrl,
      coverImageAuthor,
      coverImageAuthorUrl,
      coverImageUnsplashUrl,
    } = req.body;

    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILE:", req.file);

    /*
    |--------------------------------------------------------------------------
    | Find Post
    |--------------------------------------------------------------------------
    */

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Ownership Check
    |--------------------------------------------------------------------------
    */

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update Title
    |--------------------------------------------------------------------------
    */

    if (title !== undefined) {
      post.title = title;

      /*
      |--------------------------------------------------------------------------
      | Update Slug
      |--------------------------------------------------------------------------
      */

      post.slug = generateSlug(title);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Content
    |--------------------------------------------------------------------------
    */

    if (content !== undefined) {
      post.content = content;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Tags
    |--------------------------------------------------------------------------
    */

    if (tags !== undefined) {
      post.tags = await handlePostTags(tags);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

    if (status !== undefined) {
      post.status = status;
    }

    /*
    |--------------------------------------------------------------------------
    | Cover Image
    |--------------------------------------------------------------------------
    |
    | Priority:
    |
    | 1. New uploaded local image
    | 2. New Unsplash image
    | 3. Existing image remains unchanged
    |
    */

    /*
    |--------------------------------------------------------------------------
    | New Local Upload
    |--------------------------------------------------------------------------
    */

    if (req.file) {
      post.coverImage = req.file.path;

      /*
      |--------------------------------------------------------------------------
      | Clear Unsplash Metadata
      |--------------------------------------------------------------------------
      */

      post.coverImageUrl = "";

      post.coverImageAuthor = "";

      post.coverImageAuthorUrl = "";

      post.coverImageUnsplashUrl = "";
    } else if (coverImageUrl) {
      /*
    |--------------------------------------------------------------------------
    | New Unsplash Image
    |--------------------------------------------------------------------------
    */
      post.coverImage = coverImageUrl;

      post.coverImageUrl = coverImageUrl;

      post.coverImageAuthor = coverImageAuthor || "";

      post.coverImageAuthorUrl = coverImageAuthorUrl || "";

      post.coverImageUnsplashUrl = coverImageUnsplashUrl || "";
    }

    /*
    |--------------------------------------------------------------------------
    | Save Post
    |--------------------------------------------------------------------------
    */

    await post.save();

    /*
    |--------------------------------------------------------------------------
    | Get Updated Post With Populated Fields
    |--------------------------------------------------------------------------
    */

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug");

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

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

/*
|--------------------------------------------------------------------------
| Delete Post
|--------------------------------------------------------------------------
*/

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    /*
    |--------------------------------------------------------------------------
    | Find Post
    |--------------------------------------------------------------------------
    */

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Ownership Check
    |--------------------------------------------------------------------------
    */

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Post
    |--------------------------------------------------------------------------
    */

    await Post.findByIdAndDelete(id);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

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
