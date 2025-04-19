const express = require("express");
const multer = require("multer");
const {
  createRecording,
  getAllRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
} = require("../controllers/recordingController");
const verifyToken = require("../middleware/verifyAuth");
const checkAllowedEmails = require("../middleware/checkAllowedEmails");
const requireVerification = require("../middleware/requireVerification");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/recordings", verifyToken, requireVerification, getAllRecordings);

router.get(
  "/recordings/:id",
  verifyToken,
  checkAllowedEmails,
  requireVerification,
  getRecordingById
);

router.post(
  "/recordings",
  verifyToken,
  checkAllowedEmails,
  requireVerification,
  upload.single("audioFile"),
  createRecording
);

router.put(
  "/recordings/:id",
  verifyToken,
  checkAllowedEmails,
  requireVerification,
  updateRecording
);

router.delete(
  "/recordings/:id",
  verifyToken,
  checkAllowedEmails,
  requireVerification,
  deleteRecording
);

module.exports = router;
