const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const BlogRoutes = require("./routes/blog.routes");
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const experiencRoutes = require("./routes/experience.routes");
const educationRoutes = require("./routes/education.routes");
const bodyParser = require("body-parser");
const corsOptions = require("./config/corsOption");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: "dqcags0nr",
  api_key: "163853889843489",
  api_secret: "BIynzq9qN0-TkQTbYgzwItPXAH4",
});

// Log the configuration
console.log(cloudinary.config());

dotenv.config();
app.use(cors());

app.use(bodyParser.json());

app.use("/api/blogs", BlogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experiences", experiencRoutes);
app.use("/api/educations", educationRoutes);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((error) => {
    console.log(error);
    console.log("Error connecting to database", error);
  });
