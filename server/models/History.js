const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true
    },
    action: {
      type: String,
      enum: ["joined", "left"],
      required: true
    },
    queueLength: {
      type: Number,
      default: 0
    },
    waitTime: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);