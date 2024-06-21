const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  organization: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const Experience = mongoose.model("Experience", ExperienceSchema);

module.exports = Experience; // Export the model
