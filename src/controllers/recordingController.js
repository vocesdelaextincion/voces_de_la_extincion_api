const Recording = require("../models/recording");

const createRecording = async (req, res) => {
  try {
    const { name, duration, location, date, time, tags } = req.body;
    const recording = new Recording({
      name,
      duration,
      location,
      date,
      time,
      tags,
    });
    await recording.save();
    res.status(201).json(recording);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRecording };
