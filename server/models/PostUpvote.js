import mongoose from "mongoose";

const postUpvoteSchema = new mongoose.Schema(
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

postUpvoteSchema.index(
  {
    post: 1,
    user: 1,
  },
  {
    unique: true,
  },
);

const PostUpvote = mongoose.model("PostUpvote", postUpvoteSchema);

export default PostUpvote;
