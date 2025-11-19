import express from "express";

import { registerController, loginController, refreshController, logoutController } from "../controllers/accountController.js";

const router = express.Router();

/**
 * @swagger
 * /api/account/register:
 *   get:
 *     summary: Account register page
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Returns register form
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
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - username
 *               - birthDate
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Joe
 *               surname:
 *                 type: string
 *                 example: Doe
 *               username:
 *                  type: string
 *                  example: JoeDoe
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 01-01-2000
 *               email:
 *                 type: string
 *                 example: joe@doe.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: joeDoe123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing or invalid input
 *       409:
 *         description: Email or username already used
 *       500:
 *         description: Something went wrong
 */
router.post('/register', registerController);

/**
 * @swagger
 * /api/account/login:
 *   get:
 *     summary: Account login page
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Returns login form
 */
router.get('/login', (req, res) => {
    res.status(200).json({ message: 'Login GET Page' });
});

router.post("/login", loginController);

router.post("/refresh", refreshController);
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

export default router;