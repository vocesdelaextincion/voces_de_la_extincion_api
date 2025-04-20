const express = require("express");
const { 
  registerUser, 
  loginUser, 
  verifyUser, 
  forgotPassword, 
  resetPassword 
} = require("../controllers/userController");
const requireVerification = require("../middleware/requireVerification");

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
/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verificar correo electrónico
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Correo electrónico verificado exitosamente.
 *       401:
 *         description: Token inválido.
 */

router.post("/register", registerUser);

router.post("/login", requireVerification, loginUser);

router.get("/verify-email", verifyUser);

module.exports = router;
