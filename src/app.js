const express = require("express");
require("./config/database");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");

const userAuth = require("./middleware/auth");
const { validateSignupData } = require("./helper/validation");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies
// Middleware to parse JSON request body

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  
    const user = req.user; // Use the user attached by the userAuth middleware
    res.send(user);
  
  
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get users by email
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.body._id });
    // Use _id instead of _Id for case sensitivity
    if (!user) {
      return res.send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params?.userId, // Use userId from the URL parameter
      req.body,
      { new: true } // Return the updated document
    );
    if (!user) {
      return res.send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.put("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.body._id }, // Use _id instead of _Id for case sensitivity
      req.body,
      { new: true } // Return the updated document
    );
    if (!user) {
      return res.send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
