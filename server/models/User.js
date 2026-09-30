import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =====================================
    // Basic Information
    // =====================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =====================================
    // Profile
    // =====================================

    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },

    location: {
      type: String,
      maxlength: 100,
      default: "",
      trim: true,
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    // =====================================
    // Social Links
    // =====================================

    socialLinks: {
      x: {
        type: String,
        default: "",
        trim: true,
      },

      linkedin: {
        type: String,
        default: "",
        trim: true,
      },

      github: {
        type: String,
        default: "",
        trim: true,
      },

      website: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
