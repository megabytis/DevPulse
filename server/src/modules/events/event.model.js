const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "projects",
    },
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    route: {
      type: String,
    },
    type: {
      type: String,
      enum: ["ERROR", "INFO", "WARN"],
      default: "ERROR",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const eventModel = new mongoose.model("events", eventSchema);

module.exports = {
  eventModel,
};
