const express = require("express");
const multer = require("multer");
const {
  createRecording,
  getAllRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
} = require("../controllers/recordingController");
const verifyToken = require("../middleware/verifyAuth");
const checkAllowedEmails = require("../middleware/checkAllowedEmails");
const requireVerification = require("../middleware/requireVerification");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recordings
 *   description: Recording management
 */

/**
 * @swagger
 * /recordings:
 *   get:
 *     summary: Retrieve a list of all recordings for the authenticated user
 *     tags: [Recordings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of recordings.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Recording'
 *       401:
 *         description: Unauthorized (invalid token or user not verified)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.get("/recordings", verifyToken, requireVerification, getAllRecordings);

/**
 * @swagger
 * /recordings/{id}:
 *   get:
 *     summary: Retrieve a single recording by its ID
 *     tags: [Recordings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the recording to retrieve
 *     responses:
 *       200:
 *         description: Single recording object
 *         schema:
 *           $ref: '#/definitions/Recording'
 *       401:
 *         description: Unauthorized (invalid token or user not verified)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: Forbidden (user does not own this recording)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       404:
 *         description: Recording not found
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.get(
  "/recordings/:id",
  verifyToken,
  checkAllowedEmails, // This middleware checks ownership
  requireVerification,
  getRecordingById
);

/**
 * @swagger
 * /recordings:
 *   post:
 *     summary: Create a new recording
 *     tags: [Recordings]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: audioFile
 *         type: file
 *         required: true
 *         description: The audio file to upload.
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the recording.
 *       - in: formData
 *         name: location
 *         type: string
 *         description: Location where the recording was made.
 *       - in: formData
 *         name: date
 *         type: string
 *         format: date
 *         description: Date of the recording (YYYY-MM-DD).
 *       - in: formData
 *         name: time
 *         type: string
 *         description: Time of the recording (HH:MM).
 *       - in: formData
 *         name: tags
 *         type: string # Changed to string, assuming comma-separated
 *         description: Comma-separated tags for the recording (e.g., 'nature,birdsong').
 *     responses:
 *       201:
 *         description: Recording created successfully
 *         schema:
 *           $ref: '#/definitions/Recording'
 *       400:
 *         description: Bad request (e.g., missing required fields, invalid data format)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       401:
 *         description: Unauthorized (invalid token or user not verified)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal server error (e.g., file upload failed)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.post(
  "/recordings",
  verifyToken,
  checkAllowedEmails, // Also applies here to associate with the correct user
  requireVerification,
  upload.single("audioFile"),
  createRecording
);

/**
 * @swagger
 * /recordings/{id}:
 *   put:
 *     summary: Update an existing recording's metadata
 *     tags: [Recordings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the recording to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/definitions/RecordingUpdate" # Use the specific update model
 *     responses:
 *       200:
 *         description: Recording metadata updated successfully
 *         schema:
 *           $ref: '#/definitions/Recording'
 *       400:
 *         description: Bad request (e.g., invalid data format)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       401:
 *         description: Unauthorized (invalid token or user not verified)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: Forbidden (user does not own this recording)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       404:
 *         description: Recording not found
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.put(
  "/recordings/:id",
  verifyToken,
  checkAllowedEmails, // Checks ownership
  requireVerification,
  updateRecording
);

/**
 * @swagger
 * /recordings/{id}:
 *   delete:
 *     summary: Delete a recording
 *     tags: [Recordings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the recording to delete
 *     responses:
 *       200:
 *         description: Recording deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *              message:
 *                 type: string
 *                 example: "Grabación eliminada exitosamente."
 *       401:
 *         description: Unauthorized (invalid token or user not verified)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       403:
 *         description: Forbidden (user does not own this recording)
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       404:
 *         description: Recording not found
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.delete(
  "/recordings/:id",
  verifyToken,
  checkAllowedEmails, // Checks ownership
  requireVerification,
  deleteRecording
);

module.exports = router;
