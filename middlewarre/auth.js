const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decodedData = jwt.verify(token, secret);
    req.user = decodedData.user; // Set req.user to the decoded user object

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token, authorization denied" });
  }
};

module.exports = auth;
