const { google } = require('googleapis');
const stream = require('stream');

// TODO: Replace with your actual credentials path and desired folder ID
// Ensure GOOGLE_APPLICATION_CREDENTIALS points to your service account key file
// and GOOGLE_DRIVE_FOLDER_ID is set in your .env file
const KEYFILEPATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; 
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

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
  const drive = google.drive({ version: 'v3', auth });

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
      fields: 'id',
    });
    console.log('File uploaded successfully. File ID:', response.data.id);
    // TODO: Consider making the file public or generating a shareable link if needed
    // You might need additional permissions or API calls for that.
    // For now, we return the ID. You might construct a direct link if feasible
    // or store the ID and manage permissions separately.
    return response.data.id; // Returning the file ID
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive.');
  }
};

module.exports = { uploadFile };
