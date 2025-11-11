import express from "express";

import { registerUser } from "../controllers/accountController.js";

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
router.get("/register", (req, res) => {
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
 *                 example: joeDoe123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing or invalid input
 *       409:
 *         description: User already registered
 *       500:
 *         description: Something went wrong
 */
router.post("/register", async (req, res) => {
    try {
        const result = await registerUser(req.body);

        if(!result.success) {
            return res.status(result.status).json({ message: result.message || "Validation failed", fieldErrors: result.errors || {} });
        }

        res.status(result.status).json({ message: result.message });
    } 
    catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get("/login", (req, res) => {
    res.send("Login GET page");
});

router.post("/login", (req, res) => {
    res.send("Login POST page");
});

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