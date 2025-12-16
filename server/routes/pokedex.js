import express from "express";

import Pokemon from "../models/Pokemon.js";
import PokemonSprite from "../models/PokemonSprite.js";

const router = express.Router();

/**
 * @swagger
 * /api/pokedex/list:
 *   get:
 *     summary: Pokedex list page
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Returns list of discovered pokemons
 */
router.get('/list', async (req, res) => {
    try {
        const pokemonList = await Pokemon.find().lean();
        const sprites = await PokemonSprite.find().lean();

        const spriteMap = Object.fromEntries(
            sprites.map(s => [String(s.pokedexNumber), s])
        );

        const output = pokemonList.map(p => {
            const id = String(p.pokedexNumber);
            return {
                id,
                name: p.name || "Unknown",
                types: [p.typeOne, p.typeTwo].filter(Boolean),
                sprite: spriteMap[id]?.pokedexFrontSprite || null
            };
        });

        return res.status(200).json(output);

    }catch(err) {
        console.error("Error fetching Pokemons:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;