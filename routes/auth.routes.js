const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../schema/user.schema");

// Utility function to generate JWT token
const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };

  // Generate JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // Expires in 1 hour (adjust as needed)
  });

  return token;
};

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid Email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(user.password);

    if (!isMatch) {
      console.log("Passwords do not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Login Successful");
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/logout", async (req, res) => {
  try {
    // Clear the token from the client-side
    res.clearCookie("token");

    // Optionally, you can also invalidate the token on the server-side
    // by storing it in a blacklist or clearing it from a cache/database

    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
