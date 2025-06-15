const express = require("express");
const userAuth = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const user = express.Router();
// get all
user.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl", "age"]);

      console.log("Connection Requests:", connectionRequests);
    res.status(200).json({
      message: "User requests fetched successfully",
      requests: connectionRequests,
    });
  } catch (err) {
    console.error("Error in fetching user requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
user.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connections = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl", "age"])
      .populate("toUserId", ["firstName", "lastName", "photoUrl", "age"]);
console.log(connections)
    const data = connections.map((connection) => ({
      fromUserId: connection.fromUserId,
      toUserId: connection.toUserId,
      status: connection.status,
    }));

    res.status(200).json({
      message: "Connections fetched successfully",
      connections: data,
    });
  } catch (err) {
    console.error("Error in fetching connections", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


user.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
   const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
const skip = parseInt((page - 1) * limit) || 0;

    const connectionRequests = await connectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName photoUrl age skills gender about").skip(skip);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = user;
