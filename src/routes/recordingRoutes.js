const express = require("express");
const multer = require('multer');
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
 * /recordings:
 *   get:
 *     summary: Obtener todas las grabaciones
 *     tags: [Recordings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grabaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/Recording"
 *       401:
 *         description: No autorizado.
 */

/**
 * @swagger
 * /recordings:
 *   post:
 *     summary: Crear una nueva grabación (con subida de audio)
 *     tags: [Recordings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: 
 *                 type: string
 *                 description: Nombre de la grabación.
 *               duration:
 *                 type: number
 *                 format: float
 *                 description: Duración en segundos.
 *               location:
 *                 type: string
 *                 description: Ubicación (opcional).
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha (YYYY-MM-DD).
 *               time:
 *                 type: string
 *                 description: Hora (HH:MM).
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Etiquetas (opcional).
 *               audioFile: 
 *                 type: string
 *                 format: binary
 *                 description: El archivo de audio a subir.
 *     responses:
 *       201:
 *         description: Grabación creada exitosamente.
 *       403:
 *         description: Acceso denegado.
 *      401:
 *        description: No autorizado.
 *     500:
 *      description: Error del servidor.
 *
 */

/**
 * @swagger
 * /recordings/{recordingId}:
 *  get:
 *   summary: Obtener una grabación por su ID
 *  tags: [Recordings]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 *  name: recordingId
 * required: true
 * description: ID de la grabación
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Grabación encontrada
 * content:
 * application/json:
 * schema:
 * $ref: '#/definitions/Recording'
 * 404:
 * description: Grabación no encontrada
 * 401:
 * description: No autorizado
 */

/**
 * @swagger
 * /recordings/{recordingId}:
 * put:
 * summary: Actualizar una grabación por su ID
 * tags: [Recordings]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: recordingId
 * required: true
 * description: ID de la grabación
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/definitions/Recording'
 * responses:
 * 200:
 * description: Grabación actualizada
 * content:
 * application/json:
 * schema:
 * $ref: '#/definitions/Recording'
 * 404:
 * description: Grabación no encontrada
 * 401:
 * description: No autorizado
 */

/**
 * @swagger
 * /recordings/{recordingId}:
 * delete:
 * summary: Eliminar una grabación por su ID
 * tags: [Recordings]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: recordingId
 * required: true
 * description: ID de la grabación
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Grabación eliminada
 * 404:
 * description: Grabación no encontrada
 * 401:
 * description: No autorizado
 */

router.get("/recordings", verifyToken, requireVerification, getAllRecordings);

router.get(
  "/recordings/:recordingId",
  verifyToken,
  requireVerification,
  getRecordingById
);

router.post(
  "/recordings",
  verifyToken,
  checkAllowedEmails,
  requireVerification,
  upload.single('audioFile'),
  createRecording
);

router.put(
  "/recordings/:recordingId",
  verifyToken,
  checkAllowedEmails,
  requireVerification,
  updateRecording
);

router.delete(
  "/recordings/:recordingId",
  verifyToken,
  checkAllowedEmails,
  requireVerification,
  deleteRecording
);

module.exports = router;
