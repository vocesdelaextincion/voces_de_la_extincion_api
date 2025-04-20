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
 *   name: Auth
 *   description: User authentication and verification
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/definitions/User"
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *         schema:
 *           type: object
 *           properties:
 *              message: 
 *                  type: string
 *                  example: "Usuario registrado con éxito. Por favor verifica tu correo electrónico."
 *       400:
 *          description: Invalid input (e.g., email already exists, weak password)
 *          schema:
 *              $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal server error.
 *         schema:
 *              $ref: "#/definitions/ErrorResponse"
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     security: []
 *     description: Authenticates a user and returns a JWT token upon successful login. Requires email verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/definitions/User"
 *     responses:
 *       200:
 *         description: Login successful.
 *         schema:
 *           $ref: "#/definitions/LoginResponse"
 *       401:
 *         description: Invalid credentials or email not verified.
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal server error.
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.post("/login", requireVerification, loginUser);

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify user's email address
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token sent to the user's email
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *         schema:
 *           type: object
 *           properties:
 *              message:
 *                  type: string
 *                  example: "Correo electrónico verificado exitosamente."
 *       400:
 *         description: Invalid or expired token.
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal server error.
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.get("/verify-email", verifyUser);

module.exports = router;
