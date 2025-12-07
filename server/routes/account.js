import express from "express";

import { registerController, loginController, refreshController, logoutController, checkUsernameController, checkEmailController } from "../controllers/accountController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - surname
 *         - birthDate
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: JoeDoe
 *         name:
 *           type: string
 *           example: Joe
 *         surname:
 *           type: string
 *           example: Doe
 *         birthDate:
 *           type: string
 *           format: date
 *           example: 2000-01-01
 *         email:
 *           type: string
 *           example: joe@doe.com
 *         password:
 *           type: string
 *           format: password
 *           example: JoeDoe123!
 *
 *     LoginDto:
 *       type: object
 *       required:
 *         - userIdentifier
 *         - password
 *       properties:
 *         userIdentifier:
 *           type: string
 *           example: JoeDoe
 *         password:
 *           type: string
 *           format: password
 *           example: JoeDoe123!
 *         rememberMe:
 *           type: boolean
 *           example: true
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User registered successfully
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Logged out
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Server error
 *         errors:
 *           type: object
 *           example:
 *             email: "Email already used"
 */

/**
 * @swagger
 * /api/account/register:
 *   get:
 *     summary: Get register page
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Returns register page message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Register GET Page
 */

router.get('/register', (req, res) => {
    res.status(200).json({ message: 'Register GET Page' });
});

/**
 * @swagger
 * /api/account/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email or username already taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */

router.post('/register', registerController);

/**
 * @swagger
 * /api/account/login:
 *   get:
 *     summary: Get login page
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Returns login page message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Login GET Page
 */

router.get('/login', (req, res) => {
    res.status(200).json({ message: 'Login GET Page' });
});

/**
 * @swagger
 * /api/account/login:
 *   post:
 *     summary: Log in user with email/username + password
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid input or wrong credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginController);

/**
 * @swagger
 * /api/account/refresh:
 *   post:
 *     summary: Refresh access token using valid refresh token cookie
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Missing refresh token
 *       403:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Internal server error
 */

router.post("/refresh", refreshController);

/**
 * @swagger
 * /api/account/logout:
 *   post:
 *     summary: Log out user and invalidate tokens
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: User logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       500:
 *         description: Internal server error
 */

router.post("/logout", logoutController);

router.get("/edit", (req, res) => {
    res.send("Edit GET page");
});

router.post("/edit", (req, res) => {
    res.send("Edit POST page");
});

router.get("/details", (req, res) => {
    res.send("Details GET page");
});

router.get("/check-username", checkUsernameController);

router.get("/check-email", checkEmailController);

export default router;