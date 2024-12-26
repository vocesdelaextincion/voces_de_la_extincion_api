const express = require("express");
const { createRecording, getAllRecordings } = require("../controllers/recordingController");

const router = express.Router();

router.post("/recordings", createRecording);

router.get("/recordings", getAllRecordings)

module.exports = router;
