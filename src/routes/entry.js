const express = require('express');
const User = require('../models/user');
const entry= express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignupData } = require('../helper/validation');

entry.post("/signup", async (req, res) => {
  try {
    validateSignupData(req.body);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passwordHash,
    });
    user.save();
    res.status(200).json({ message: "User data received", data: req.body });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

entry.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" }); // correct message for attackers
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const token= jwt.sign({userId: user._id}, "merasecretPassword@123", { expiresIn: '1h' });
      res.cookie("token", token);
      res.send({
        message: "Login successful",
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          emailId: user.emailId,
          age: user.age,
        },
      });
    
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
    
});
module.exports = entry;