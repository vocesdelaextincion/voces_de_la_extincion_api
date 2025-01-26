const express = require("express");
const {
  createRecording,
  getAllRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
} = require("../controllers/recordingController");
const verifyToken = require("../middleware/verifyAuth");
const checkAllowedEmails = require("../middleware/checkAllowedEmails");

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
 *     summary: Crear una nueva grabación
 *     tags: [Recordings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/definitions/Recording"
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

router.get("/recordings", verifyToken, getAllRecordings);

router.get("/recordings/:recordingId", verifyToken, getRecordingById);

router.post("/recordings", verifyToken, checkAllowedEmails, createRecording);

router.put(
  "/recordings/:recordingId",
  verifyToken,
  checkAllowedEmails,
  updateRecording
);

router.delete(
  "/recordings/:recordingId",
  verifyToken,
  checkAllowedEmails,
  deleteRecording
);

module.exports = router;
