import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

bookmarkSchema.index(
  {
    post: 1,
    user: 1,
  },
  {
    unique: true,
  },
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
