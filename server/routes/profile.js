import express from "express";
import { getUsers, getCurrentUser } from "../controllers/profileController.js";

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user profile data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/", async (req, res) => {
    try {
        // req.user comes from authRequired middleware
        const user = await getCurrentUser(req.user.id);
        res.status(200).json(user);
    } 
    catch(err) {
        console.error(err);
        
        if (err.message === 'User not found') {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/list:
 *   get:
 *     summary: Profile list page
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Returns list of user profiles
 */
router.get("/list", async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/details:
 *   get:
 *     summary: Profile details page
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Returns details of user profile
 */
router.get("/details", (req, res) => {
    res.send("Details GET page");
});

export default router;