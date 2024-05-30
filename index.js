const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const BlogRoutes = require("./routes/blog.routes");
const authRoutes = require("./routes/auth.routes");
const bodyParser = require("body-parser");

dotenv.config();
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.use("/api/blogs", BlogRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Conected to database");

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(() => {
    console.log("Error connecting to database");
  });
