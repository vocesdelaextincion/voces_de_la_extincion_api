const { google } = require("googleapis");
const stream = require("stream");

// TODO: Replace with your actual credentials path and desired folder ID
// Ensure GOOGLE_APPLICATION_CREDENTIALS points to your service account key file
// and GOOGLE_DRIVE_FOLDER_ID is set in your .env file
const KEYFILEPATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
// Updated scope to include permission management
const SCOPES = ["https://www.googleapis.com/auth/drive"];

/**
 * Authenticates with Google Drive API using a service account.
 * @returns {google.auth.GoogleAuth} Authenticated GoogleAuth client.
 */
const authenticate = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  return auth;
};

/**
 * Uploads a file buffer to Google Drive.
 * @param {Buffer} fileBuffer The buffer containing the file data.
 * @param {string} fileName The desired name for the file in Google Drive.
 * @param {string} mimeType The MIME type of the file.
 * @returns {Promise<string>} The ID of the uploaded file in Google Drive.
 */
const uploadFile = async (fileBuffer, fileName, mimeType) => {
  const auth = authenticate();
  const drive = google.drive({ version: "v3", auth });

  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileBuffer);

  const fileMetadata = {
    name: fileName,
    parents: FOLDER_ID ? [FOLDER_ID] : [], // Specify the folder ID here
  };

  const media = {
    mimeType: mimeType,
    body: bufferStream,
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });
    const fileId = response.data.id;
    console.log("File uploaded successfully. File ID:", fileId);

    // Make the file publicly readable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    console.log("Permissions updated to public read for File ID:", fileId);

    // Returning the file ID. A direct web link might be constructible
    // using 'https://drive.google.com/uc?id=FILE_ID' but might depend on file type/settings.
    return fileId;
  } catch (error) {
    console.error("Error uploading file or setting permissions:", error);
    throw new Error(
      "Failed to upload file to Google Drive or set permissions."
    );
  }
};

/**
 * Deletes a file from Google Drive.
 * @param {string} fileId The ID of the file to delete.
 * @returns {Promise<void>}
 */
const deleteFile = async (fileId) => {
  const auth = authenticate();
  const drive = google.drive({ version: "v3", auth });

  try {
    await drive.files.delete({ fileId: fileId });
    console.log(`File deleted successfully. File ID: ${fileId}`);
  } catch (error) {
    console.error(`Error deleting file ${fileId} from Google Drive:`, error);
    // Decide if the error should propagate or be handled differently
    // For example, if the file doesn't exist, maybe it's not a critical error?
    if (error.code === 404) {
      console.warn(
        `File ${fileId} not found in Google Drive. Proceeding as if deleted.`
      );
      return; // Or handle as appropriate
    }
    throw new Error("Failed to delete file from Google Drive.");
  }
};

module.exports = { uploadFile, deleteFile };
