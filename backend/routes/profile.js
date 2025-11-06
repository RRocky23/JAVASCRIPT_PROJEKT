import express from "express";

const router = express.Router();

/**
 * @swagger
 * /profile/list:
 *   get:
 *     summary: Profile list page
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Returns list of user profiles
 */
router.get("/list", (req, res) => {
    res.send("List GET page");
});

/**
 * @swagger
 * /profile/details:
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