import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import PostUpvote from "../models/PostUpvote.js";
import Bookmark from "../models/Bookmark.js";
import { getSocketIO } from "../socket/socketInstance.js";
import { createNotification } from "../services/notification/notificationService.js";

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId).select("_id author title slug");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await PostLike.findOne({
      post: postId,
      user: userId,
    });

    if (existingLike) {
      return res.status(400).json({
        message: "Post already liked",
      });
    }

    await PostLike.create({
      post: postId,
      user: userId,
    });

    await createNotification({
      recipient: post.author,
      sender: userId,
      type: "like",
      post: post._id,
      message: "liked your post",
    });

    const likeCount = await PostLike.countDocuments({
      post: postId,
    });

    const io = getSocketIO();

    io.to(`post:${postId}`).emit("post:like:updated", {
      postId,
      likedBy: req.user._id,
      likeCount,
    });

    return res.status(201).json({
      message: "Post liked successfully",
      liked: true,
      likeCount,
    });
  } catch (error) {
    console.error("Like post error:", error);

    return res.status(500).json({
      message: "Failed to like post",
    });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await PostLike.findOneAndDelete({
      post: postId,
      user: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    const likeCount = await PostLike.countDocuments({
      post: postId,
    });

    const io = getSocketIO();

    io.to(`post:${postId}`).emit("post:like:updated", {
      postId,
      likedBy: req.user._id,
      likeCount,
    });

    return res.status(200).json({
      message: "Post unliked successfully",
      liked: false,
      likeCount,
    });
  } catch (error) {
    console.error("Unlike post error:", error);

    return res.status(500).json({
      message: "Failed to unlike post",
    });
  }
};

export const upvotePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId).select("_id author title slug");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingUpvote = await PostUpvote.findOne({
      post: postId,
      user: userId,
    });

    if (existingUpvote) {
      return res.status(400).json({
        message: "Post already upvoted",
      });
    }

    await PostUpvote.create({
      post: postId,
      user: userId,
    });

    await createNotification({
      recipient: post.author,
      sender: userId,
      type: "upvote",
      post: post._id,
      message: "upvoted your post",
    });

    const upvoteCount = await PostUpvote.countDocuments({
      post: postId,
    });

    const io = getSocketIO();

    io.to(`post:${postId}`).emit("post:upvote:updated", {
      postId,
      upvotedBy: req.user._id,
      upvoteCount,
    });

    return res.status(201).json({
      message: "Post upvoted successfully",
      upvoted: true,
      upvoteCount,
    });
  } catch (error) {
    console.error("Upvote post error:", error);

    return res.status(500).json({
      message: "Failed to upvote post",
    });
  }
};

export const removeUpvote = async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await PostUpvote.findOneAndDelete({
      post: postId,
      user: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        message: "Upvote not found",
      });
    }

    const upvoteCount = await PostUpvote.countDocuments({
      post: postId,
    });

    const io = getSocketIO();

    io.to(`post:${postId}`).emit("post:upvote:updated", {
      postId,
      upvotedBy: req.user._id,
      upvoteCount,
    });

    return res.status(200).json({
      message: "Upvote removed successfully",
      upvoted: false,
      upvoteCount,
    });
  } catch (error) {
    console.error("Remove upvote error:", error);

    return res.status(500).json({
      message: "Failed to remove upvote",
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId).select("_id");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingBookmark = await Bookmark.findOne({
      post: postId,
      user: userId,
    });

    if (existingBookmark) {
      return res.status(400).json({
        message: "Post already bookmarked",
      });
    }

    await Bookmark.create({
      post: postId,
      user: userId,
    });

    const bookmarkCount = await Bookmark.countDocuments({
      post: postId,
    });

    return res.status(201).json({
      message: "Post bookmarked successfully",
      bookmarked: true,
      bookmarkCount,
    });
  } catch (error) {
    console.error("Bookmark post error:", error);

    return res.status(500).json({
      message: "Failed to bookmark post",
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await Bookmark.findOneAndDelete({
      post: postId,
      user: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }

    const bookmarkCount = await Bookmark.countDocuments({
      post: postId,
    });

    return res.status(200).json({
      message: "Bookmark removed successfully",
      bookmarked: false,
      bookmarkCount,
    });
  } catch (error) {
    console.error("Remove bookmark error:", error);

    return res.status(500).json({
      message: "Failed to remove bookmark",
    });
  }
};

export const getPostInteractions = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const [
      likeCount,
      upvoteCount,
      bookmarkCount,
      isLiked,
      isUpvoted,
      isBookmarked,
    ] = await Promise.all([
      PostLike.countDocuments({ post: postId }),

      PostUpvote.countDocuments({ post: postId }),

      Bookmark.countDocuments({ post: postId }),

      PostLike.exists({
        post: postId,
        user: userId,
      }),

      PostUpvote.exists({
        post: postId,
        user: userId,
      }),

      Bookmark.exists({
        post: postId,
        user: userId,
      }),
    ]);

    return res.status(200).json({
      likeCount,
      upvoteCount,
      bookmarkCount,

      isLiked: Boolean(isLiked),
      isUpvoted: Boolean(isUpvoted),
      isBookmarked: Boolean(isBookmarked),
    });
  } catch (error) {
    console.error("Get post interactions error:", error);

    return res.status(500).json({
      message: "Failed to fetch post interactions",
    });
  }
};

// ======================================================
// GET USER BOOKMARK COUNT
// ======================================================

export const getUserBookmarkCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookmarkCount = await Bookmark.countDocuments({
      user: userId,
    });

    return res.status(200).json({
      bookmarkCount,
    });
  } catch (error) {
    console.error("Get user bookmark count error:", error);

    return res.status(500).json({
      message: "Failed to fetch bookmark count",
    });
  }
};

export const getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookmarks = await Bookmark.find({
      user: userId,
    })
      .populate({
        path: "post",
        match: { status: "published" },
        populate: [
          {
            path: "author",
            select: "name avatarUrl",
          },
          {
            path: "tags",
            select: "name slug",
          },
        ],
      })
      .sort({ createdAt: -1 });

    // Deleted / unavailable posts বাদ
    const posts = bookmarks
      .filter((bookmark) => bookmark.post)
      .map((bookmark) => bookmark.post);

    return res.status(200).json({
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Get user bookmarks error:", error);

    return res.status(500).json({
      message: "Failed to fetch user bookmarks",
    });
  }
};
