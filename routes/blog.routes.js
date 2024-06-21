const express = require("express");
const router = express.Router();
const auth = require("../middlewarre/auth"); // Authentication middleware

const Blog = require("../schema/blog.schema");
const upload = require("../multer/uploader");
const uploadImages = require("../middlewarre/uploadImage");

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by latest first
    res.json(blogs);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get a specific blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create a new blog (Requires Authentication)
router.post(
  "/",
  auth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  uploadImages,
  async (req, res) => {
    const { title, content } = req.body;
    const image = req.app.locals.fileUrls?.image?.[0] || "";

    try {
      // Check if the user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newBlog = new Blog({
        title,
        content,
        image,
        author: req.user._id,
      });

      const savedBlog = await newBlog.save();
      res.json(savedBlog);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Update a blog by ID (Requires Authentication)
router.put(
  "/:id",
  auth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  uploadImages,
  async (req, res) => {
    const { title, content } = req.body;
    let image = req.body.image || "";

    // Check if a new image was uploaded
    if (req.app.locals.fileUrls) {
      image = req.app.locals?.fileUrls?.image?.[0] || image;
    }

    // Build update object
    const update = {
      title,
      content,
      image,
    };

    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Uncomment if you need to check for user authorization
      // if (blog?.author.toString() !== req.user.id) {
      //   return res.status(401).json({ message: "Unauthorized to update this blog" });
      // }

      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, update, {
        new: true,
      });
      res.json(updatedBlog);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedBlog = await Blog.deleteOne({ _id: req.params.id });
    if (deletedBlog.deletedCount === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
