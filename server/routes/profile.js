import express from "express";
import { 
  getUsers, 
  getCurrentUser,
  getAllPokemons,
  getPokemonById,
  getPokemonStats,
  getPokemonMoves,
  getPokemonEvolutions,
  getPokemonLocations
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

export default router;