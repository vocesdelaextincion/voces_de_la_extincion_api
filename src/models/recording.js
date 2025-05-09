const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    tags: {
      type: [{ value: String, label: String }],
      required: false,
    },
    audioUrl: {
      type: String,
      required: false,
    },
    googleDriveFileId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recording", recordingSchema);
