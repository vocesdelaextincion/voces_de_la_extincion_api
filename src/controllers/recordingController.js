const Recording = require("../models/recording");
const { uploadFile } = require("../services/googleDriveService"); // Import the service
const path = require("path");
const crypto = require("crypto");

const createRecording = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para crear una grabación (sube archivo a GDrive)'
  try {
    const { name, duration, location, date, time } = req.body;
    let audioUrl = null; // Initialize audioUrl
    let parsedTags = []; // Initialize tags

    if (req.file) {
      console.log("Received file:", req.file.originalname);
      const fileBuffer = req.file.buffer;
      const originalName = req.file.originalname;
      const mimeType = req.file.mimetype;
      const extension = path.extname(originalName);
      const timestamp = new Date().toISOString().replace(/[:.-]/g, ""); // YYYYMMDDTHHMMSSsssZ -> YYYYMMDDTHHMMSSsssZ
      const randomString = crypto.randomBytes(4).toString("hex"); // Add random bytes for uniqueness
      const uniqueFileName = `recording_${timestamp}_${randomString}${extension}`;

      try {
        console.log(`Uploading ${uniqueFileName} to Google Drive...`);
        const fileId = await uploadFile(fileBuffer, uniqueFileName, mimeType);
        // Construct a potential viewer link (requires file to be public or shared)
        // Adjust based on how you manage permissions and access
        audioUrl = `https://drive.google.com/file/d/${fileId}/view`;
        // Alternatively, just store the fileId: audioUrl = fileId;
        console.log(`File uploaded. Google Drive URL/ID: ${audioUrl}`);
      } catch (uploadError) {
        console.error("Google Drive upload failed:", uploadError);
        // Decide if the recording should still be created without the audio
        // return res.status(500).json({ message: "Failed to upload audio file.", error: uploadError.message });
        // Or proceed to save metadata without audioUrl
      }
    } else {
      console.log("No file uploaded with the request.");
      // Handle case where no file is provided - perhaps return an error or allow creation without audio
      // For now, we proceed, audioUrl will be null
    }

    // Parse tags if they were sent as a JSON string
    if (req.body.tags && typeof req.body.tags === "string") {
      try {
        parsedTags = JSON.parse(req.body.tags);
        // Basic validation: check if it's an array
        if (!Array.isArray(parsedTags)) {
          throw new Error("Tags must be an array.");
        }
        // Optional: Further validation to ensure items have value/label
        const isValid = parsedTags.every(
          (tag) =>
            typeof tag === "object" &&
            tag !== null &&
            "value" in tag &&
            "label" in tag
        );
        if (!isValid) {
          throw new Error(
            "Each tag object must have value and label properties."
          );
        }
      } catch (e) {
        console.error("Failed to parse tags JSON string or invalid format:", e);
        return res
          .status(400)
          .json({ message: `Invalid format for tags: ${e.message}` });
      }
    } else if (Array.isArray(req.body.tags)) {
      // If tags were somehow parsed as an array already (less likely with form-data)
      parsedTags = req.body.tags;
    } // If req.body.tags is undefined or null, parsedTags remains []

    const newRecording = await Recording.create({
      name,
      duration,
      location,
      date,
      time,
      tags: parsedTags, // Use the parsed array
      audioUrl, // Use the URL/ID from Google Drive or null
    });
    res.status(201).json(newRecording);
  } catch (error) {
    console.error("Error creating recording:", error);
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
  // TODO: Consider how file updates should work. Replace file in GDrive? Allow URL update?
  try {
    const { name, duration, location, date, time, tags, audioUrl } = req.body;
    const { recordingId } = req.params;

    // Note: This update allows directly setting audioUrl via body.
    // If updating the file itself is needed, similar logic to createRecording
    // (handling req.file, uploading, deleting old file?) would be required here.

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
      return res.status(404).json({ message: "Grabación no encontrada" }); // Added return
    }
    res.status(200).json(updatedRecording);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecording = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para borrar una grabación'
  // TODO: Implement deletion of the corresponding file from Google Drive
  try {
    const { recordingId } = req.params;
    const deletedRecording = await Recording.findByIdAndDelete(recordingId); // Added await
    if (!deletedRecording) {
      return res.status(404).json({ message: "Grabación no encontrada" }); // Added return
    }
    // Optional: Add logic here to delete file from Google Drive using deletedRecording.audioUrl (if it stores the ID)
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
