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
connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
}).catch((err)=>{
    console.error("Database connection failed", err);
});

