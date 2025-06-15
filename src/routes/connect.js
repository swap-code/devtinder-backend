const express = require("express");
const userAuth = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const connect = express.Router();

connect.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const validStatuses = ["interested", "ignored"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    // Check if the user is trying to connect with themselves
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }
    // Check if the user is trying to connect with an invalid user ID
    const toUser= await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the connection request already exists
    const existingRequest = await connectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const newRequest = new connectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    // Save the new connection request
    const data = await newRequest.save();
    res
      .status(201)
      .json({ message: "Connection request sent successfully", data });
  } catch (err) {
    console.error("Error in sending connection request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

connect.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user._id;
      const requestId = req.params.requestId;
      const status = req.params.status;
      const validStatusesss = ["accepted", "rejected"];
      // if (!validStatusesss.includes(status)) {
      //   return res.status(400).json({ message: "Invalid status provided" });
      // }
      // Check if the requestId is valid and belongs to the logged-in user
      const request = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
    console.log("Connection request found:", request);
      if (!request) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }
      request.status = status;
      console.log("Updating connection request status to:", request.status);
      const data = await request.save();
      console.log("Connection request updated:", data); 
      res
        .status(200)
        .json({
          message: "Connection request " + status + " successfully",
          data
        });
    }  catch (err) {
  console.error("Error in reviewing connection request:", err);
  res.status(500).json({ message: "Internal server error" });
}
    });
module.exports = connect;
