import express from "express";
import {
  getUsers,
  getCurrentUser,
  getAllPokemons,
  getPokemonById,
  getPokemonStats,
  getPokemonMoves,
  getPokemonEvolutions,
  getPokemonLocations,
  getTutorialStatus,
  selectStarterPokemon,
  completeTutorial,
  getPokemonCount,
  getDiscoveryCount
} from "../controllers/profileController.js";

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
 * /api/profile/pokedex:
 *   get:
 *     summary: Get all pokemons (Pokedex)
 *     tags: [Profile]
 */
router.get("/pokedex", async (req, res) => {
    try {
        const pokemons = await getAllPokemons(req.query);
        res.status(200).json(pokemons);
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/pokedex/:id:
 *   get:
 *     summary: Get pokemon by pokedex number
 *     tags: [Profile]
 */
router.get("/pokedex/:id", async (req, res) => {
    try {
        const pokemon = await getPokemonById(req.params.id);
        res.status(200).json(pokemon);
    } 
    catch(err) {
        console.error(err);
        if (err.message === 'Pokemon not found') {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/pokedex/:id/stats:
 *   get:
 *     summary: Get pokemon stats
 *     tags: [Profile]
 */
router.get("/pokedex/:id/stats", async (req, res) => {
    try {
        const stats = await getPokemonStats(req.params.id);
        res.status(200).json(stats);
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/pokedex/:id/moves:
 *   get:
 *     summary: Get pokemon moves
 *     tags: [Profile]
 */
router.get("/pokedex/:id/moves", async (req, res) => {
    try {
        const moves = await getPokemonMoves(req.params.id);
        res.status(200).json(moves);
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/pokedex/:id/evolutions:
 *   get:
 *     summary: Get pokemon evolution chain
 *     tags: [Profile]
 */
router.get("/pokedex/:id/evolutions", async (req, res) => {
    try {
        const evolutions = await getPokemonEvolutions(req.params.id);
        res.status(200).json(evolutions);
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/pokedex/:id/locations:
 *   get:
 *     summary: Get pokemon spawn locations
 *     tags: [Profile]
 */
router.get("/pokedex/:id/locations", async (req, res) => {
    try {
        const locations = await getPokemonLocations(req.params.id);
        res.status(200).json(locations);
    } 
    catch(err) {
        console.error(err);
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

/**
 * @swagger
 * /api/profile/tutorial-status:
 *   get:
 *     summary: Get user's tutorial status
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns tutorial status
 *       401:
 *         description: Unauthorized
 */
router.get("/tutorial-status", async (req, res) => {
    try {
        const status = await getTutorialStatus(req.user.id);
        res.status(200).json(status);
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
 * /api/profile/select-starter:
 *   post:
 *     summary: Select starter Pokemon
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               starter:
 *                 type: string
 *                 enum: [bulbasaur, charmander, squirtle]
 *     responses:
 *       200:
 *         description: Starter Pokemon selected successfully
 *       400:
 *         description: Invalid starter choice or user already has starter
 *       401:
 *         description: Unauthorized
 */
router.post("/select-starter", async (req, res) => {
    try {
        const { starter } = req.body;

        if (!starter) {
            return res.status(400).json({ message: 'Starter choice is required' });
        }

        const result = await selectStarterPokemon(req.user.id, starter);
        res.status(200).json(result);
    }
    catch(err) {
        console.error(err);
        if (err.message === 'Invalid starter Pokemon choice') {
            return res.status(400).json({ message: 'Invalid starter choice. Choose bulbasaur, charmander, or squirtle.' });
        }
        if (err.message === 'User already has a starter Pokemon') {
            return res.status(400).json({ message: 'You already have a starter Pokemon' });
        }
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/complete-tutorial:
 *   post:
 *     summary: Mark tutorial as completed
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tutorial completed successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/complete-tutorial", async (req, res) => {
    try {
        const result = await completeTutorial(req.user.id);
        res.status(200).json(result);
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
 * /api/profile/pokemon/count:
 *   get:
 *     summary: Get count of user's Pokemon
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns count of user's Pokemon
 *       401:
 *         description: Unauthorized
 */
router.get("/pokemon/count", async (req, res) => {
    try {
        const result = await getPokemonCount(req.user.id);
        res.status(200).json(result);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/profile/discoveries/count:
 *   get:
 *     summary: Get count of user's discoveries
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns count of user's discoveries
 *       401:
 *         description: Unauthorized
 */
router.get("/discoveries/count", async (req, res) => {
    try {
        const result = await getDiscoveryCount(req.user.id);
        res.status(200).json(result);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;