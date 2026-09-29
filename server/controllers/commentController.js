import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

import { getSocketIO } from "../socket/socketInstance.js";
import { createNotification } from "../services/notification/notificationService.js";

// ======================================================
// CREATE COMMENT / REPLY
// POST /api/comments/posts/:postId
// ======================================================

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentComment = null } = req.body;
    const userId = req.user._id;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    // Check post
    const post = await Post.findById(postId).select("_id author title slug");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check parent comment for replies
    if (parentComment) {
      const parent = await Comment.findOne({
        _id: parentComment,
        post: postId,
      });

      if (!parent) {
        return res.status(404).json({
          message: "Parent comment not found",
        });
      }
    }

    // Create comment / reply
    const comment = await Comment.create({
      post: postId,
      author: userId,
      content: content.trim(),
      parentComment,
    });

    // Populate author
    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name username avatarUrl",
    );

    // Realtime event
    const io = getSocketIO();

    io.to(`post:${postId}`).emit("comment:created", populatedComment);

    // Notify post author
    await createNotification({
      recipient: post.author,
      sender: userId,
      type: "comment",
      post: post._id,
      comment: comment._id,
      message: "commented on your post",
    });

    // Detect mentions
    const mentions = [...content.matchAll(/@([a-zA-Z0-9_]+)/g)].map(
      (match) => match[1],
    );

    const uniqueMentions = [
      ...new Set(mentions.map((item) => item.toLowerCase())),
    ];

    for (const username of uniqueMentions) {
      const mentionedUser = await User.findOne({
        $or: [{ username }, { name: username }],
      }).select("_id");

      if (!mentionedUser) continue;

      await createNotification({
        recipient: mentionedUser._id,
        sender: userId,
        type: "mention",
        post: post._id,
        comment: comment._id,
        message: "mentioned you in a discussion",
      });
    }

    return res.status(201).json({
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

// ======================================================
// GET POST COMMENTS
// GET /api/comments/posts/:postId
// ======================================================

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      post: postId,
    })
      .populate("author", "name username avatarUrl")
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};

// ======================================================
// UPDATE COMMENT / REPLY
// PATCH /api/comments/:commentId
// ======================================================

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        author: req.user._id,
      },
      {
        content: content.trim(),
      },
      {
        new: true,
      },
    ).populate("author", "name username avatarUrl");

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or unauthorized",
      });
    }

    // Realtime update
    const io = getSocketIO();

    io.to(`post:${comment.post}`).emit("comment:updated", comment);

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Update comment error:", error);

    return res.status(500).json({
      message: "Failed to update comment",
    });
  }
};

// ======================================================
// DELETE COMMENT / REPLY
// DELETE /api/comments/:commentId
// ======================================================

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      author: req.user._id,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or unauthorized",
      });
    }

    // Save post ID before deleting replies
    const postId = comment.post.toString();

    // Delete direct replies
    await Comment.deleteMany({
      parentComment: commentId,
    });

    // Realtime delete event
    const io = getSocketIO();

    io.to(`post:${postId}`).emit("comment:deleted", {
      commentId,
      postId,
    });

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentId,
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};

// ======================================================
// GET USER COMMENTS
// GET /api/comments/users/:userId
// ======================================================

export const getUserComments = async (req, res) => {
  try {
    const { userId } = req.params;

    const comments = await Comment.find({
      author: userId,
    })
      .populate("author", "name username avatarUrl")
      .populate("post", "title slug")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      comments,
      totalComments: comments.length,
    });
  } catch (error) {
    console.error("Get user comments error:", error);

    return res.status(500).json({
      message: "Failed to fetch user comments",
    });
  }
};
