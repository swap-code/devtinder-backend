const express = require("express");
require("./config/database");
const connectDB = require("./config/database");
const connect = require("./routes/connect");
const entry = require("./routes/entry");
const profile = require("./routes/profile");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

app.use("/", entry);
app.use("/",  connect);
app.use("/", profile);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
