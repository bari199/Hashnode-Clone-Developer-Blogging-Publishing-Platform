import Tag from "../models/Tag.js";

const handlePostTags = async (tagNames = []) => {
  const tagIds = [];

  for (const tagName of tagNames) {
    const normalizedName = tagName.trim().toLowerCase();

    if (!normalizedName) {
      continue;
    }

    let tag = await Tag.findOne({
      name: normalizedName,
    });

    if (!tag) {
      const slug = normalizedName
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      tag = await Tag.create({
        name: normalizedName,
        slug,
      });
    }

    tagIds.push(tag._id);
  }

  return tagIds;
};

export default handlePostTags;
