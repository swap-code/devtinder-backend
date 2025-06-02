const express= require('express');
require("./config/database");
const connectDB = require('./config/database');
const User = require('./models/user');
const app= express();

app.use(express.json());
// Middleware to parse JSON request body

app.post("/signup", async (req, res) => {
    console.log("Headers:", req.headers);
    console.log("Raw Body:", req.body);
    res.status(200).json({ message: "User data received", data: req.body });

const user= new User(req.body)
user.save();
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        console.log("Fetched Users:", users);
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
        console.log("Fetched User:", user);
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
       console.log("Deleted User:", user);
       res.send(user);
    } catch (error) {
        console.error("Error deleting user:", error);
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
        console.log("Updated User:", user);
        res.send(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
}).catch((err)=>{
    console.error("Database connection failed", err);
});

