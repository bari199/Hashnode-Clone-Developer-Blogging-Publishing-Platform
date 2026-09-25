import User from "../models/User.js";
import Post from "../models/Post.js";

// =====================================
// GET /api/users/:id
// Public
// =====================================

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name bio avatarUrl",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = await Post.find({
      author: user._id,
      status: "published",
    })
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      user,
      posts,
    });
  } catch (error) {
    console.error("Get user profile error:", error.message);

    return res.status(500).json({
      message: "Failed to load profile",
    });
  }
};

export const getTrendingAuthors = async (req, res) => {
  try {
    const now = new Date();

    // First day of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Next month
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const authors = await Post.aggregate([
      {
        $match: {
          status: "published",
          createdAt: {
            $gte: startOfMonth,
            $lt: startOfNextMonth,
          },
        },
      },

      {
        $group: {
          _id: "$author",
          postCount: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          postCount: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },

      {
        $unwind: "$author",
      },

      {
        $project: {
          _id: "$author._id",
          name: "$author.name",
          avatarUrl: "$author.avatarUrl",
          bio: "$author.bio",
          postCount: 1,
        },
      },
    ]);

    return res.status(200).json({
      authors,
    });
  } catch (error) {
    console.error("Get trending authors error:", error);

    return res.status(500).json({
      message: "Failed to fetch trending authors",
    });
  }
};

// =====================================
// PUT /api/users/me
// Protected
// =====================================

export const updateMyProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name.trim();
    user.bio = bio?.trim() || "";

    if (req.file) {
      user.avatarUrl = req.file.path;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
