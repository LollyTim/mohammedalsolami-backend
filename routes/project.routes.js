const express = require("express");
const router = express.Router();
const auth = require("../middlewarre/auth"); // Authentication middleware

const Project = require("../schema/projecct.schema");
const upload = require("../multer/uploader");
const uploadImages = require("../middlewarre/uploadImage");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Sort by latest first
    res.json(projects);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get a specific project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create a new project (Requires Authentication)
// Create a new project (Requires Authentication)
router.post(
  "/",
  auth,
  upload.fields([
    { name: "mediaUrls", maxCount: 6 },
    { name: "coverImage", maxCount: 1 },
  ]),
  uploadImages,
  async (req, res) => {
    const { title, description, technologies, client, type, year, preview } =
      req.body;
    const mediaUrls = req.app.locals.fileUrls?.mediaUrls || [];
    const coverImage = req.app.locals.fileUrls?.coverImage?.[0] || "";

    try {
      // Check if the user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newProject = new Project({
        title,
        description,
        technologies,
        client,
        type,
        year,
        preview,
        mediaUrls,
        coverImage,
        // author: req.user._id, // Uncomment if you need to associate the project with a user
      });

      const savedProject = await newProject.save();
      res.json(savedProject);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Update a project by ID (Requires Authentication)
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "mediaUrls", maxCount: 4 },
    { name: "coverImage", maxCount: 1 },
  ]),
  uploadImages,
  async (req, res) => {
    const { title, description, technologies, client, type, year, preview } =
      req.body;
    let mediaUrls = req.body.mediaUrls || [];
    let coverImage = req.body.coverImage || "";

    // Check if new images were uploaded
    if (req.app.locals.fileUrls) {
      mediaUrls = req.app.locals.fileUrls.mediaUrls || mediaUrls;
      coverImage = req.app.locals.fileUrls.coverImage?.[0] || coverImage;
    }

    // Build update object
    const update = {
      title,
      description,
      technologies,
      client,
      type,
      year,
      preview,
      mediaUrls,
      coverImage,
    };

    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // if (project?.author.toString() !== req.user.id) {
      //   return res.status(401).json({ message: "Unauthorized to update this project" });
      // }

      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
        }
      );
      res.json(updatedProject);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedProject = await Project.deleteOne({ _id: req.params.id });
    if (deletedProject.deletedCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
