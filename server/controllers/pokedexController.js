import Pokemon from '../models/Pokemon.js';
import PokemonSprite from '../models/PokemonSprite.js';
import PokemonStat from '../models/PokemonStat.js';
import PokemonMove from '../models/PokemonMove.js';
import PokemonEvolution from '../models/PokemonEvolution.js';
import UserPokemon from '../models/UserPokemon.js';
import UserDiscovery from '../models/UserDiscovery.js';

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
            owned: false
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
            const pokemon = pokemonMap[userPokemon.pokemonId];
            const sprite = spriteMap[userPokemon.pokemonId]?.pokedexFrontSprite || null;

            return {
                ...userPokemon,
                ...pokemon,
                sprite,
                discovered: true,
                owned: true
            };
        });

        return userPokemonData;
    }
    catch(err) {
        console.error('Error fetching all pokemons:', err);
        throw err;
    }
};