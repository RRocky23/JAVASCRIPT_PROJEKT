import express from "express";
import { getUsers } from "../controllers/profileController.js";

const router = express.Router();

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