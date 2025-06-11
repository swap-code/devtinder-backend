const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "pending", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  // Ensure that the fromUserId and toUserId are not the same
  if (this.fromUserId.toString() === this.toUserId.toString()) {
    return next(new Error("Cannot connect with yourself"));
  }
  next();
});
module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
