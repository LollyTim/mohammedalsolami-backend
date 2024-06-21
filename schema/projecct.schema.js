const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: {
    type: [String],
    required: true,
  },
  client: {
    type: String,
  },
  type: {
    type: String, // You can define different project types (e.g., "Website", "Mobile App")
  },
  year: {
    type: Number,
  },
  preview: {
    type: String, // URL for external preview or path to media file
  },
  mediaUrls: {
    type: [
      {
        type: String, // URL for video or path to image file on server
      },
    ],
  },
  coverImage: {
    type: String, // URL for the cover image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add a field for author (if user-based projects)
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  // },
});

module.exports = mongoose.model("Project", ProjectSchema);
