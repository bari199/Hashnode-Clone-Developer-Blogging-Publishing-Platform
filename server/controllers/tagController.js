import Tag from "../models/Tag.js";
import Post from "../models/Post.js";

export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });

    const tagsWithPostCount = await Promise.all(
      tags.map(async (tag) => {
        const postCount = await Post.countDocuments({
          tags: tag._id,
          status: "published",
        });

        return {
          _id: tag._id,
          name: tag.name,
          slug: tag.slug,
          postCount,
        };
      }),
    );

    res.status(200).json({
      tags: tagsWithPostCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tags",
      error: error.message,
    });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const { slug } = req.params;

    const tag = await Tag.findOne({ slug });

    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }

    const posts = await Post.find({
      tags: tag._id,
      status: "published",
    })
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tag: {
        name: tag.name,
        slug: tag.slug,
      },
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts by tag",
      error: error.message,
    });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Tag name is required",
      });
    }

    const normalizedName = name.trim().toLowerCase();

    const existingTag = await Tag.findOne({
      name: normalizedName,
    });

    if (existingTag) {
      return res.status(409).json({
        message: "Tag already exists",
        tag: existingTag,
      });
    }

    const slug = normalizedName
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const tag = await Tag.create({
      name: normalizedName,
      slug,
    });

    res.status(201).json({
      message: "Tag created successfully",
      tag,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create tag",
      error: error.message,
    });
  }
};
