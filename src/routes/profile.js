const express = require("express");
const userAuth = require("../middleware/auth");
const profile = express.Router();

profile.get("/profile", userAuth, async (req, res) => {
  const user = req.user; // Use the user attached by the userAuth middleware
  res.send(user);
});

module.exports = profile;
