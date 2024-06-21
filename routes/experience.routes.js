const express = require("express");
const router = express.Router();
const Experience = require("../schema/experience.schema");

// Create (POST) experience
router.post("/", async (req, res) => {
  const { title, organization, description, startDate, endDate } = req.body;

  try {
    const newExperience = new Experience({
      title,
      organization,
      description,
      startDate,
      endDate,
    });

    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error creating experience" });
  }
});

// Get all experiences (GET)
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 }); // Sort by latest first
    res.json(experiences);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error retrieving experiences" });
  }
});

// Get a specific experience by ID (GET)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(experience);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error retrieving experience" });
  }
});

// Update an experience by ID (PUT)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, organization, description, startDate, endDate } = req.body;

  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      { title, organization, description, startDate, endDate },
      { new: true }
    );
    if (!updatedExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(updatedExperience);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error updating experience" });
  }
});

// Delete an experience by ID (DELETE)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExperience = await Experience.findByIdAndDelete(id);
    if (!deletedExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json({ message: "Experience deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error deleting experience" });
  }
});

module.exports = router;
