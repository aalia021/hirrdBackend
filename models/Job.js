const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [4, "Title must be at least 4 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      minlength: [20, "Description must be at least 20 characters"],
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    logo: {
      type: String, // Stored file path like "uploads/logo-123456.png"
      default: "",
    },
    recruiter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
