const express = require("express");
const { createRecording } = require("../controllers/recordingController");

const router = express.Router();

router.post("/recordings", createRecording);

module.exports = router;
