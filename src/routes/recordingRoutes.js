const express = require("express");
const {
  createRecording,
  getAllRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
} = require("../controllers/recordingController");

const router = express.Router();

router.post("/recordings", createRecording);

router.get("/recordings", getAllRecordings);

router.get("/recordings/:recordingId", getRecordingById);

router.put("/recordings/:recordingId", updateRecording);

router.delete("/recordings/:recordingId", deleteRecording);

module.exports = router;
