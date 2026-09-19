import Tag from "../models/Tag.js";

const handlePostTags = async (tags) => {
  if (!tags) {
    return [];
  }

  let tagList = tags;

  // FormData থেকে tags string হিসেবে এলে
  if (typeof tags === "string") {
    try {
      tagList = JSON.parse(tags);
    } catch (error) {
      tagList = tags.split(",");
    }
  }

  if (!Array.isArray(tagList)) {
    return [];
  }

  const tagIds = [];

  for (const tag of tagList) {
    const tagName = tag?.name || tag;

    if (!tagName || !tagName.trim()) {
      continue;
    }

    const name = tagName.trim().toLowerCase();

    const slug = name
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    let existingTag = await Tag.findOne({ slug });

    if (!existingTag) {
      existingTag = await Tag.create({
        name,
        slug,
      });
    }

    tagIds.push(existingTag._id);
  }

  return tagIds;
};

export default handlePostTags;
