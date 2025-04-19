const Recording = require("../models/recording");

const createRecording = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para crear una grabación'
  try {
    const { name, duration, location, date, time, tags, audioUrl } = req.body;
    const newRecording = await Recording.create({
      name,
      duration,
      location,
      date,
      time,
      tags,
      audioUrl,
    });
    res.status(201).json(newRecording);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRecordings = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para obtener todas las grabaciones'
  try {
    const filters = req.query;
    const recordings = await Recording.find(filters);
    res.status(200).json(recordings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecordingById = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para obtener una grabación por ID'
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
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para actualizar una grabación'
  try {
    const { name, duration, location, date, time, tags, audioUrl } = req.body;
    const { recordingId } = req.params;
    const updatedRecording = await Recording.findByIdAndUpdate(
      recordingId,
      {
        name,
        duration,
        location,
        date,
        time,
        tags,
        audioUrl,
      },
      { new: true }
    );
    if (!updatedRecording) {
      res.status(404).json({ message: "Grabación no encontrada" });
    }
    res.status(200).json(updatedRecording);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecording = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para borrar una grabación'
  // NOTA Hay un error acá. No se borra el registro de la BBDD
  try {
    const { recordingId } = req.params;
    const deletedRecording = Recording.findByIdAndDelete(recordingId);
    if (!deletedRecording) {
      res.status(404).json({ message: "Grabación no encontrada" });
    }
    res.status(200).json({ message: "Grabación borrada" });
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
