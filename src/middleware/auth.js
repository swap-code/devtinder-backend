const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ensure this path is correct
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "merasecretPassword@123");
    const { userId } = decoded;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in userAuth middleware:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = userAuth;
