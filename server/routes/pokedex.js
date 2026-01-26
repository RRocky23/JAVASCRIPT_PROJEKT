import express from "express";
import { getAllPokemons, getUserPokemons, changePokemonFavoriteStatus } from "../controllers/pokedexController.js";
import {
    getPokemonById,
    getPokemonStats,
    getPokemonMoves,
    getPokemonEvolutions,
    getPokemonSprites
} from "../controllers/profileController.js";

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
    catch (err) {
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
    catch (err) {
        console.error('Error fetching all pokemons:', err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get('/getPokemon/:id', async (req, res) => {
    try {
        const pokemonId = req.params.id;

        const pokemon = await getPokemonById(pokemonId);
        const stats = await getPokemonStats(pokemonId);
        const moves = await getPokemonMoves(pokemonId);
        const evolutions = await getPokemonEvolutions(pokemonId);
        const sprite = await getPokemonSprites(pokemonId);

        res.status(200).json({
            ...pokemon.toObject(),
            stats,
            moves,
            evolutions,
            spriteURL: sprite?.spriteURL ?? null,
            sprite: sprite?.sprite ?? null
        });
    } catch (err) {
        console.error('Error fetching pokemon details:', err);
        res.status(404).json({ message: 'Pokemon not found' });
    }
});

router.get('/getPokemon/:id/stats', async (req, res) => {
    try {
        const stats = await getPokemonStats(req.params.id);
        res.status(200).json(stats);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: 'Stats not found' });
    }
});

router.get('/getPokemon/:id/moves', async (req, res) => {
    try {
        const moves = await getPokemonMoves(req.params.id);
        res.status(200).json(moves);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: 'Moves not found' });
    }
});

router.get('/getPokemon/:id/evolutions', async (req, res) => {
    try {
        const evolutions = await getPokemonEvolutions(req.params.id);
        res.status(200).json(evolutions);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: 'Evolutions not found' });
    }
});


router.patch('/changePokemonFavoriteStatus/:pokemonId/', async (req, res) => {
    return await changePokemonFavoriteStatus(req.user.id, req.params, req.body, res);
});

export default router;