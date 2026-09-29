import User from "../models/User.js";
import Tag from "../models/Tag.js";
import UserFollow from "../models/UserFollow.js";
import TagFollow from "../models/TagFollow.js";

import { getSocketIO } from "../socket/socketInstance.js";
import { createNotification } from "../services/notification/notificationService.js";

// ======================================================
// FOLLOW USER
// ======================================================

export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    // Cannot follow yourself
    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    // Check target user
    const targetUser = await User.findById(targetUserId).select(
      "_id name username avatarUrl",
    );

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check existing follow
    const existingFollow = await UserFollow.findOne({
      follower: currentUserId,
      following: targetUserId,
    });

    if (existingFollow) {
      return res.status(400).json({
        message: "Already following this user",
      });
    }

    // Create follow
    await UserFollow.create({
      follower: currentUserId,
      following: targetUserId,
    });

    // Updated counts
    const followerCount = await UserFollow.countDocuments({
      following: targetUserId,
    });

    const followingCount = await UserFollow.countDocuments({
      follower: targetUserId,
    });

    // Notification
    await createNotification({
      recipient: targetUserId,
      sender: currentUserId,
      type: "follow_user",
      message: "started following you",
    });

    // Realtime event
    const io = getSocketIO();

    if (io) {
      io.to(`user:${targetUserId}`).emit("follow:updated", {
        targetUserId,
        follower: currentUserId,
        following: true,
        followerCount,
        followingCount,
      });
    }

    return res.status(201).json({
      message: "User followed successfully",
      following: true,
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error("Follow user error:", error);

    return res.status(500).json({
      message: "Failed to follow user",
    });
  }
};

// ======================================================
// UNFOLLOW USER
// ======================================================

export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    // Delete follow relationship
    const result = await UserFollow.findOneAndDelete({
      follower: currentUserId,
      following: targetUserId,
    });

    if (!result) {
      return res.status(404).json({
        message: "Follow relationship not found",
      });
    }

    // Updated counts
    const followerCount = await UserFollow.countDocuments({
      following: targetUserId,
    });

    const followingCount = await UserFollow.countDocuments({
      follower: targetUserId,
    });

    // Realtime event
    const io = getSocketIO();

    if (io) {
      io.to(`user:${targetUserId}`).emit("follow:updated", {
        targetUserId,
        follower: currentUserId,
        following: false,
        followerCount,
        followingCount,
      });
    }

    return res.status(200).json({
      message: "User unfollowed successfully",
      following: false,
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error("Unfollow user error:", error);

    return res.status(500).json({
      message: "Failed to unfollow user",
    });
  }
};

// ======================================================
// GET USER FOLLOW STATUS
// ======================================================

export const getUserFollowStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    // Check follow status
    const existingFollow = await UserFollow.exists({
      follower: currentUserId,
      following: targetUserId,
    });

    // Follower count
    const followerCount = await UserFollow.countDocuments({
      following: targetUserId,
    });

    // Following count
    const followingCount = await UserFollow.countDocuments({
      follower: targetUserId,
    });

    return res.status(200).json({
      following: Boolean(existingFollow),
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error("Get user follow status error:", error);

    return res.status(500).json({
      message: "Failed to get follow status",
    });
  }
};

// ======================================================
// GET FOLLOWERS
// ======================================================

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await UserFollow.find({
      following: userId,
    })
      .populate("follower", "_id name username avatarUrl")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      followers,
    });
  } catch (error) {
    console.error("Get followers error:", error);

    return res.status(500).json({
      message: "Failed to fetch followers",
    });
  }
};

// ======================================================
// GET FOLLOWING
// ======================================================

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await UserFollow.find({
      follower: userId,
    })
      .populate("following", "_id name username avatarUrl")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      following,
    });
  } catch (error) {
    console.error("Get following error:", error);

    return res.status(500).json({
      message: "Failed to fetch following",
    });
  }
};

// ======================================================
// FOLLOW TAG
// ======================================================

export const followTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const currentUserId = req.user._id;

    // Check tag
    const tag = await Tag.findById(tagId).select("_id name slug");

    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }

    // Check existing follow
    const existingFollow = await TagFollow.findOne({
      user: currentUserId,
      tag: tagId,
    });

    if (existingFollow) {
      return res.status(400).json({
        message: "Already following this tag",
      });
    }

    // Create tag follow
    await TagFollow.create({
      user: currentUserId,
      tag: tagId,
    });

    // Updated follower count
    const followerCount = await TagFollow.countDocuments({
      tag: tagId,
    });

    return res.status(201).json({
      message: "Tag followed successfully",
      following: true,
      followerCount,
    });
  } catch (error) {
    console.error("Follow tag error:", error);

    return res.status(500).json({
      message: "Failed to follow tag",
    });
  }
};

// ======================================================
// UNFOLLOW TAG
// ======================================================

export const unfollowTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const currentUserId = req.user._id;

    // Delete tag follow
    const result = await TagFollow.findOneAndDelete({
      user: currentUserId,
      tag: tagId,
    });

    if (!result) {
      return res.status(404).json({
        message: "Tag follow relationship not found",
      });
    }

    // Updated follower count
    const followerCount = await TagFollow.countDocuments({
      tag: tagId,
    });

    return res.status(200).json({
      message: "Tag unfollowed successfully",
      following: false,
      followerCount,
    });
  } catch (error) {
    console.error("Unfollow tag error:", error);

    return res.status(500).json({
      message: "Failed to unfollow tag",
    });
  }
};

// ======================================================
// GET TAG FOLLOW STATUS
// ======================================================

export const getTagFollowStatus = async (req, res) => {
  try {
    const { tagId } = req.params;
    const currentUserId = req.user._id;

    // Check tag
    const tag = await Tag.findById(tagId).select("_id");

    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }

    // Check follow status
    const existingFollow = await TagFollow.exists({
      user: currentUserId,
      tag: tagId,
    });

    // Follower count
    const followerCount = await TagFollow.countDocuments({
      tag: tagId,
    });

    return res.status(200).json({
      following: Boolean(existingFollow),
      followerCount,
    });
  } catch (error) {
    console.error("Get tag follow status error:", error);

    return res.status(500).json({
      message: "Failed to get tag follow status",
    });
  }
};

// ======================================================
// GET USER FOLLOWED TAGS
// ======================================================

export const getUserFollowedTags = async (req, res) => {
  try {
    const { userId } = req.params;

    const followedTags = await TagFollow.find({
      user: userId,
    })
      .populate("tag", "_id name slug")
      .sort({
        createdAt: -1,
      });

    const tags = followedTags.map((item) => item.tag).filter(Boolean);

    return res.status(200).json({
      tags,
      count: tags.length,
    });
  } catch (error) {
    console.error("Get user followed tags error:", error);

    return res.status(500).json({
      message: "Failed to fetch followed tags",
    });
  }
};
