const express = require("express");
const {
  createRecording,
  getAllRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
} = require("../controllers/recordingController");
const verifyToken = require("../middleware/verifyAuth");
const checkAllowedEmails = require("../middleware/checkAllowedEmails");

const router = express.Router();

router.get("/recordings", verifyToken, getAllRecordings);

router.get("/recordings/:recordingId", verifyToken, getRecordingById);

router.post("/recordings", verifyToken, checkAllowedEmails, createRecording);

router.put(
  "/recordings/:recordingId",
  verifyToken,
  checkAllowedEmails,
  updateRecording
);

router.delete(
  "/recordings/:recordingId",
  verifyToken,
  checkAllowedEmails,
  deleteRecording
);

module.exports = router;
