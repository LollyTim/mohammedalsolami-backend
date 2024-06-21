const express = require("express");
const router = express.Router();

const Education = require("../schema/education.scheme"); // Adjust the path to your models

// Create (POST) education
router.post("/", async (req, res) => {
  const { title, schoolOrAcademy, shortDescription, startDate, endDate } =
    req.body;

  console.log("Received data:", req.body); // Log received data

  try {
    const newEducation = new Education({
      title,
      schoolOrAcademy,
      shortDescription,
      startDate,
      endDate,
    });

    console.log("New education object:", newEducation); // Log created object

    const savedEducation = await newEducation.save();
    res.status(201).json(savedEducation);
  } catch (err) {
    console.error(err.message); // Log detailed error message
    res.status(500).json({ error: "Error creating education" });
  }
});

// Get all educations (GET)
router.get("/", async (req, res) => {
  try {
    const educations = await Education.find().sort({ startDate: -1 }); // Sort by latest first
    res.json(educations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error retrieving educations" });
  }
});

// Get a specific education by ID (GET)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const education = await Education.findById(id);
    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }
    res.json(education);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error retrieving education" });
  }
});

// Update an education by ID (PUT)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, schoolOrAcademy, shortDescription, startDate, endDate } =
    req.body;

  try {
    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      { title, schoolOrAcademy, shortDescription, startDate, endDate },
      { new: true } // Return the updated document
    );
    if (!updatedEducation) {
      return res.status(404).json({ message: "Education not found" });
    }
    res.json(updatedEducation);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error updating education" });
  }
});

// Delete an education by ID (DELETE)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEducation = await Education.findByIdAndDelete(id);
    if (!deletedEducation) {
      return res.status(404).json({ message: "Education not found" });
    }
    res.json({ message: "Education deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error deleting education" });
  }
});

module.exports = router;
