import Pokemon from '../models/Pokemon.js';
import PokemonStat from '../models/PokemonStat.js';
import PokemonMove from '../models/PokemonMove.js';
import PokemonEvolution from '../models/PokemonEvolution.js';
import PokemonLocation from '../models/PokemonLocation.js';
import User from '../models/User.js'

export const getUsers = async () => {
  try {
    const pokemons = await Pokemon.find();
    return pokemons
  } 
  catch(err) {
    console.error('Error fetching pokemons:', err);
    throw err;
  }
};

export const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId).select('-passwordHash -refreshToken');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } 
  catch(err) {
    console.error('Error fetching current user:', err);
    throw err;
  }
};

// POKEDEX
export const getAllPokemons = async (query = {}) => {
  try {
    const { search, type, generation, sort = 'pokedexNumber', order = 'asc' } = query;
    
    let filter = {};
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    if (type) {
      filter.$or = [
        { typeOne: type },
        { typeTwo: type }
      ];
    }
    
    if (generation) {
      filter.generation = parseInt(generation);
    }
    
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };
    
    const pokemons = await Pokemon.find(filter).sort(sortObj);
    return pokemons;
  } 
  catch(err) {
    console.error('Error fetching all pokemons:', err);
    throw err;
  }
};

export const getPokemonById = async (pokedexNumber) => {
  try {
    const pokemon = await Pokemon.findOne({ pokedexNumber: parseInt(pokedexNumber) });
    
    if (!pokemon) {
      throw new Error('Pokemon not found');
    }
    
    return pokemon;
  } 
  catch(err) {
    console.error('Error fetching pokemon:', err);
    throw err;
  }
};

export const getPokemonStats = async (pokedexNumber) => {
  try {
    const stats = await PokemonStat.findOne({ pokemonId: parseInt(pokedexNumber) });
    
    if (!stats) {
      throw new Error('Pokemon stats not found');
    }
    
    return stats;
  } 
  catch(err) {
    console.error('Error fetching pokemon stats:', err);
    throw err;
  }
};

export const getPokemonMoves = async (pokedexNumber) => {
  try {
    const moves = await PokemonMove.find({ pokemonId: parseInt(pokedexNumber) })
      .sort({ learnLevel: 1 });
    
    return moves;
  } 
  catch(err) {
    console.error('Error fetching pokemon moves:', err);
    throw err;
  }
};

export const getPokemonEvolutions = async (pokedexNumber) => {
  try {
    const pokemon = await Pokemon.findOne({ pokedexNumber: parseInt(pokedexNumber) });
    
    if (!pokemon) {
      throw new Error('Pokemon not found');
    }
    
    // Get all pokemons in the same evolution chain
    const evolutionChain = await Pokemon.find({ 
      evolutionChainId: pokemon.evolutionChainId 
    }).sort({ evolutionStage: 1 });
    
    // Get evolution details
    const evolutions = await PokemonEvolution.find({
      $or: [
        { pokemonId: parseInt(pokedexNumber) },
        { evolvesToPokemonId: parseInt(pokedexNumber) }
      ]
    });
    
    return {
      chain: evolutionChain,
      details: evolutions
    };
  } 
  catch(err) {
    console.error('Error fetching pokemon evolutions:', err);
    throw err;
  }
};

export const getPokemonLocations = async (pokedexNumber) => {
  try {
    const locations = await PokemonLocation.find({ 
      pokemonId: parseInt(pokedexNumber),
      active: true 
    });
    
    return locations;
  } 
  catch(err) {
    console.error('Error fetching pokemon locations:', err);
    throw err;
  }
};