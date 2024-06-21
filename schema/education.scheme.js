// education.scheme.js
const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  schoolOrAcademy: {
    type: String,
    required: true,
  },
  shortDescription: {
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

const Education = mongoose.model("Education", EducationSchema);

module.exports = Education; // Export the model
