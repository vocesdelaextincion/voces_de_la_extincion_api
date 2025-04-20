const Recording = require("../models/recording");
const { uploadFile, deleteFile } = require("../services/googleDriveService"); // Import the service
const path = require("path");
const crypto = require("crypto");

const createRecording = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para crear una grabación (sube archivo a GDrive)'
  try {
    const { name, duration, location, date, time } = req.body;
    let parsedTags = []; // Initialize tags
    let fileId = null; // Initialize fileId to null

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
        // Store the fileId directly
        fileId = await uploadFile(fileBuffer, uniqueFileName, mimeType);
        // Construct a potential viewer link (requires file to be public or shared)
        // Adjust based on how you manage permissions and access
        // audioUrl = `https://drive.google.com/file/d/${fileId}/view`;
        // Alternatively, just store the fileId: audioUrl = fileId;
        // console.log(`File uploaded. Google Drive URL/ID: ${audioUrl}`);
        console.log(`File uploaded. Google Drive File ID: ${fileId}`); // Log the fileId
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

    // Prepare data for MongoDB
    const recordingData = {
      name,
      duration,
      location,
      date,
      time,
      tags: parsedTags,
      audioUrl: fileId
        ? `https://drive.google.com/file/d/${fileId}/view`
        : null,
      googleDriveFileId: fileId, // Store the fileId separately or instead of audioUrl
    };

    // If a file was uploaded and we got a fileId, use it as the _id
    if (fileId) {
      recordingData._id = fileId;
    }

    try {
      const newRecording = await Recording.create(recordingData);
      res.status(201).json(newRecording);
    } catch (dbError) {
      console.error("Database save failed:", dbError);
      // Handle potential duplicate key error if using fileId as _id and it clashes
      // This assumes your Recording model allows string _id. Mongoose typically does.
      if (dbError.code === 11000) {
        // MongoDB duplicate key error code
        return res.status(409).json({
          message: "A recording with this ID already exists.",
          error: dbError.message,
        });
      }
      res.status(500).json({
        message: "Failed to save recording metadata.",
        error: dbError.message,
      });
    }
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

    // Return the recordings directly from the database
    res.status(200).json(recordings);
  } catch (error) {
    console.error("Error fetching all recordings:", error);
    res
      .status(500)
      .json({ message: "Error fetching recordings", error: error.message });
  }
};

const getRecordingById = async (req, res) => {
  const { id } = req.params;

  try {
    const recording = await Recording.findById(id);

    if (!recording) {
      return res.status(404).json({ message: "Recording not found." });
    }

    // Convert Mongoose document to a plain JavaScript object
    const recordingObject = recording.toObject();

    // Construct the audio URL if the file ID exists
    recordingObject.audioUrl = recording.googleDriveFileId
      ? `https://drive.google.com/file/d/${recording.googleDriveFileId}/view`
      : null; // Or provide a placeholder/error message

    // Send the full recording object (with added audioUrl)
    res.status(200).json(recordingObject);
  } catch (error) {
    console.error(`Error fetching recording ${id}:`, error);
    // Handle potential CastError if the ID format is invalid
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid recording ID format." });
    }
    res
      .status(500)
      .json({ message: "Error fetching recording", error: error.message });
  }
};

const updateRecording = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para actualizar una grabación'
  // File updates are not handled here. Only metadata can be updated.
  try {
    const { name, location, date, time, tags } = req.body; // Removed duration and audioUrl
    const { id } = req.params;

    // Fields allowed for update
    const updateData = {
      name,
      location,
      date,
      time,
      tags,
    };

    // Remove undefined fields to avoid overwriting existing data with null/undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedRecording = await Recording.findByIdAndUpdate(
      id,
      updateData, // Use the filtered updateData object
      { new: true } // Return the updated document
    );

    if (!updatedRecording) {
      return res.status(404).json({ message: "Grabación no encontrada" });
    }
    res.status(200).json(updatedRecording);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecording = async (req, res) => {
  // #swagger.tags = ['Recordings']
  // #swagger.description = 'Endpoint para borrar una grabación. Attempts Drive delete before DB delete.'

  const { id } = req.params;
  let recordingToDelete;

  try {
    // 1. Find the recording first to get details
    recordingToDelete = await Recording.findById(id);
    if (!recordingToDelete) {
      return res.status(404).json({ message: "Grabación no encontrada" });
    }

    // 2. Attempt to delete the Google Drive file if ID exists
    if (recordingToDelete.googleDriveFileId) {
      try {
        console.log(
          `Attempting to delete Google Drive file: ${recordingToDelete.googleDriveFileId}`
        );
        await deleteFile(recordingToDelete.googleDriveFileId);
        console.log(
          `Google Drive file ${recordingToDelete.googleDriveFileId} deleted successfully.`
        );
      } catch (driveError) {
        console.error(
          `Failed to delete Google Drive file ${recordingToDelete.googleDriveFileId}:`,
          driveError
        );
        // IMPORTANT: Stop the process if Drive deletion fails
        return res.status(500).json({
          message:
            "Error al borrar el archivo de Google Drive. Operación cancelada.",
          error: driveError.message,
        });
      }
    }

    // 3. Delete the database record *after* successful Drive deletion (or if no file)
    await Recording.findByIdAndDelete(id);
    res.status(200).json({ message: "Grabación borrada exitosamente" });
  } catch (error) {
    // Handle potential errors during DB find or the final DB delete
    console.error(
      `Error during recording deletion process for ID ${id}:`,
      error
    );

    // Check if the error happened *after* Drive deletion but during DB deletion
    if (
      recordingToDelete &&
      recordingToDelete.googleDriveFileId /* && Drive deletion was attempted and succeeded */
    ) {
      // This check is tricky without more state, but we assume if we got here after attempting drive delete,
      // it might have succeeded before this catch block.
      // Log a critical inconsistency
      console.error(
        `CRITICAL INCONSISTENCY: Google Drive file ${recordingToDelete.googleDriveFileId} may have been deleted, but DB record deletion failed for ID ${id}.`
      );
      return res.status(500).json({
        message:
          "Error al borrar el registro de la base de datos después de borrar el archivo. Se detectó una inconsistencia.",
        error: error.message,
      });
    }

    // General error (e.g., DB find failed initially)
    res.status(500).json({
      message: "Error en el proceso de borrado",
      error: error.message,
    });
  }
};

module.exports = {
  createRecording,
  getAllRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
};
