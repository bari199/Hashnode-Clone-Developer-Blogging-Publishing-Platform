import Tag from "../models/Tag.js";
import Post from "../models/Post.js";

export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().lean();

    const tagsWithAuthors = await Promise.all(
      tags.map(async (tag) => {
        const posts = await Post.find({
          tags: tag._id,
          status: "published",
        })
          .populate("author", "name avatarUrl")
          .select("author")
          .lean();

        const uniqueAuthors = [];

        const authorIds = new Set();

        for (const post of posts) {
          const author = post.author;

          if (!author) continue;

          const authorId = author._id.toString();

          if (!authorIds.has(authorId)) {
            authorIds.add(authorId);

            uniqueAuthors.push({
              _id: author._id,
              name: author.name,
              avatarUrl: author.avatarUrl || "",
            });
          }

          if (uniqueAuthors.length === 3) {
            break;
          }
        }

        return {
          _id: tag._id,
          name: tag.name,
          slug: tag.slug,
          postCount: posts.length,
          authors: uniqueAuthors,
        };
      }),
    );

    return res.status(200).json({
      tags: tagsWithAuthors,
    });
  } catch (error) {
    console.error("Get all tags error:", error);

    return res.status(500).json({
      message: "Failed to fetch tags",
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

    return res.status(200).json({
      tag: {
        _id: tag._id,
        name: tag.name,
        slug: tag.slug,
      },
      posts,
    });
  } catch (error) {
    return res.status(500).json({
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
