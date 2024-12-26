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

const getRecordingById = async (req, res) => {
  try {
    const { recordingId } = req.params;
    const recording = await Recording.findById(recordingId);
    if (!recording) {
      res.status(404).json({ message: "Grabación no encontrada" });
    }
    res.status(200).json(recording);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecording = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecording = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecording,
  getAllRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
};
