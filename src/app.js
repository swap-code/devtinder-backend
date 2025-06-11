const express = require("express");
require("./config/database");
const connectDB = require("./config/database");
const connect = require("./routes/connect");
const entry = require("./routes/entry");
const profile = require("./routes/profile");
const user= require("./routes/user");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173", // Adjust this to your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));
app.use("/", entry);
app.use("/",  connect);
app.use("/", profile);
app.use("/", user)

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
