const Recording = require("../models/recording");

const createRecording = async (req, res) => {
  try {
    const { name, duration, location, date, time, tags, audioUrl } = req.body;
    const recording = new Recording({
      name,
      duration,
      location,
      date,
      time,
      tags,
      audioUrl,
    });
    await recording.save();
    res.status(201).json(recording);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRecordings = async (req, res) => {
  try {
    const filters = req.query;
    const recordings = await Recording.find(filters);
    res.status(200).json(recordings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRecording, getAllRecordings };
