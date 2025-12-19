import express from "express";
import { getAllPokemons, getUserPokemons, changePokemonFavoriteStatus } from "../controllers/pokedexController.js";
import UserPokemon from "../models/UserPokemon.js";

const router = express.Router();

/**
 * @swagger
 * /api/pokedex/getAllPokemons:
 *   get:
 *     summary: Pokedex pokemon data
 *     tags: [Pokedex]
 *     responses:
 *       200:
 *         description: Returns list of all pokemons
 *       500:
 *         description: Erorr with fetching pokemon data
 */
router.get('/getAllPokemons/', async (req, res) => {
    try {
        const pokemons = await getAllPokemons(req.user.id);
        return res.status(200).json(pokemons);
    }
    catch(err) {
        console.error('Error fetching all pokemons:', err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/pokedex/getUserPokemons:
 *   get:
 *     summary: User pokemon data
 *     tags: [Pokedex]
 *     responses:
 *       200:
 *         description: Returns list of user pokemons
 *       500:
 *         description: Erorr with fetching pokemon data
 */
router.get('/getUserPokemons/', async (req, res) => {
    try {
        const pokemons = await getUserPokemons(req.user.id);
        return res.status(200).json(pokemons);
    }
    catch(err) {
        console.error('Error fetching all pokemons:', err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

router.patch('/changePokemonFavoriteStatus/:pokemonId/', async (req, res) => {
    return await changePokemonFavoriteStatus(req.user.id, req.params, req.body, res);
});

export default router;