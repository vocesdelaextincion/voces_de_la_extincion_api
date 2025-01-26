const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Autenticación de usuarios
 *  definitions:
 *      User:
 *          type: object
 *      required:
 *          - email
 *          - password
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          LoginResponse:
 *              type: object
 *      properties:
 *          token:
 *          type: string
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/models/User"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/models/User"
 *     responses:
 *       200:
 *         description: Login exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/models/LoginResponse"
 *       401:
 *         description: Credenciales inválidas.
 */

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
