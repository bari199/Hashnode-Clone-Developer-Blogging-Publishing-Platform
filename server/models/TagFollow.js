import mongoose from "mongoose";

const tagFollowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

tagFollowSchema.index(
  {
    user: 1,
    tag: 1,
  },
  {
    unique: true,
  },
);

const TagFollow = mongoose.model("TagFollow", tagFollowSchema);

export default TagFollow;
