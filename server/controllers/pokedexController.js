import Pokemon from '../models/Pokemon.js';
import PokemonSprite from '../models/PokemonSprite.js';
import PokemonStat from '../models/PokemonStat.js';
import PokemonMove from '../models/PokemonMove.js';
import PokemonEvolution from '../models/PokemonEvolution.js';
import UserPokemon from '../models/UserPokemon.js';
import UserDiscovery from '../models/UserDiscovery.js';
import mongoose from 'mongoose';

export const getAllPokemons = async (userId) => {
    try {
        const pokemons = await Pokemon.find().lean();
        const sprites = await PokemonSprite.find().lean();
        const discoveries = await UserDiscovery.find({ userId }).lean();
    
        const spriteMap = Object.fromEntries(
            sprites.map(s => [String(s.pokedexNumber), s])
        );

        const discoveredSet = new Set(
            discoveries.map(d => d.pokemonId)
        );
        
        const pokemonData = pokemons.map(pokemon => ({
            ...pokemon,
            sprite: spriteMap[String(pokemon.pokedexNumber)]?.pokedexFrontSprite || null,
            discovered: discoveredSet.has(pokemon.pokedexNumber),
            owned: false,
            deletedFromFavourites: false
        }));

        return pokemonData;
    } 
    catch(err) {
        console.error('Error fetching all pokemons:', err);
        throw err;
    }
};

export const getUserPokemons = async (userId) => {
    try {
        const pokemons = await Pokemon.find().lean();
        const sprites = await PokemonSprite.find().lean();
        const owned = await UserPokemon.find({ userId }).lean();

        const spriteMap = Object.fromEntries(
            sprites.map(s => [String(s.pokedexNumber), s])
        );

        const pokemonMap = Object.fromEntries(
            pokemons.map(p => [p.pokedexNumber, p])
        );

        const userPokemonData = owned.map(userPokemon => {
            const basePokemon = pokemonMap[userPokemon.pokemonId];
            const sprite = spriteMap[userPokemon.pokemonId]?.pokedexFrontSprite || null;

            return {
                ...basePokemon,
                ...userPokemon,
                sprite,
                discovered: true,
                owned: true,
                deletedFromFavourites: false
            };
        });

        return userPokemonData;
    }
    catch(err) {
        console.error('Error fetching all pokemons:', err);
        throw err;
    }
};

export const changePokemonFavoriteStatus = async (userId, { pokemonId }, { isFavorite }, res) => {
    try {
        if(typeof isFavorite !== 'boolean') {
            return res.status(400).json({ message: 'isFavorite must be a boolean' });
        }

        const userPokemon = await UserPokemon.findOne({ _id: new mongoose.Types.ObjectId(pokemonId), userId });

        if(!userPokemon) {
            return res.status(404).json({ message: 'Pokemon not found for this user' });
        }

        userPokemon.isFavourite = isFavorite;
        await userPokemon.save();

        return res.status(200).json({ success: true, pokemonId, isFavorite });
    }catch(err) {
        console.error('Favorite toggle error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};