import Pokemon from '../models/Pokemon.js';
import PokemonSprite from '../models/PokemonSprite.js';
import PokemonStat from '../models/PokemonStat.js';
import PokemonMove from '../models/PokemonMove.js';
import PokemonEvolution from '../models/PokemonEvolution.js';
import PokemonLocation from '../models/PokemonLocation.js';
import User from '../models/User.js';
import UserPokemon from '../models/UserPokemon.js';
import UserDiscovery from '../models/UserDiscovery.js';
import Inventory from '../models/Inventory.js';

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
    
    const pokemons = await Pokemon.find(filter).sort(sortObj).lean();
    const sprites = await PokemonSprite.find().lean();
    
    
    const spriteMap = Object.fromEntries(
      sprites.map(s => [String(s.pokedexNumber), s])
    );

    const mergedPokemons = pokemons.map(pokemon => ({
      ...pokemon,
      sprite: spriteMap[String(pokemon.pokedexNumber)]?.pokedexFrontSprite || null
    }));

    return mergedPokemons;
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

// TUTORIAL FUNCTIONS
export const getTutorialStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('isNewUser hasCompletedTutorial');

    if (!user) {
      throw new Error('User not found');
    }

    return {
      isNewUser: user.isNewUser,
      hasCompletedTutorial: user.hasCompletedTutorial
    };
  }
  catch(err) {
    console.error('Error fetching tutorial status:', err);
    throw err;
  }
};

export const selectStarterPokemon = async (userId, starterChoice) => {
  try {
    // Validate starter choice
    const validStarters = {
      'bulbasaur': 1,
      'charmander': 4,
      'squirtle': 7
    };

    const pokemonId = validStarters[starterChoice.toLowerCase()];
    if (!pokemonId) {
      throw new Error('Invalid starter Pokemon choice');
    }

    // Check if user already has a Pokemon (prevent multiple starters)
    const existingPokemon = await UserPokemon.findOne({ userId: userId.toString() });
    if (existingPokemon) {
      throw new Error('User already has a starter Pokemon');
    }

    // Get Pokemon data
    const pokemon = await Pokemon.findOne({ pokedexNumber: pokemonId });
    const stats = await PokemonStat.findOne({ pokemonId });
    const moves = await PokemonMove.find({ pokemonId }).sort({ learnLevel: 1 }).limit(2);

    if (!pokemon || !stats) {
      throw new Error('Pokemon data not found');
    }

    // Create starter Pokemon with level 5
    const level = 5;
    const baseHp = stats.hp;
    const maxHp = Math.floor((2 * baseHp * level) / 100 + level + 10);

    const newUserPokemon = new UserPokemon({
      userId: userId.toString(),
      pokemonId,
      customName: null,
      height: pokemon.height,
      weight: pokemon.weight,
      level,
      experiencePoints: 0,
      currentHp: maxHp,
      maxHp,
      maxPp: 100,
      attack: Math.floor((2 * stats.attack * level) / 100 + 5),
      defense: Math.floor((2 * stats.defense * level) / 100 + 5),
      specialAttack: Math.floor((2 * stats.specialAttack * level) / 100 + 5),
      specialDefense: Math.floor((2 * stats.specialDefense * level) / 100 + 5),
      speed: Math.floor((2 * stats.speed * level) / 100 + 5),
      moveOne: moves[0]?.moveName || 'tackle',
      moveTwo: moves[1]?.moveName || 'growl',
      moveThree: null,
      moveFour: null,
      isFavourite: true,
      caughtDate: new Date(),
      caughtLocationLat: 0,
      caughtLocationLng: 0,
      caughtBallType: 'starter'
    });

    await newUserPokemon.save();

    // Create discovery entry for Pokedex
    const discovery = new UserDiscovery({
      userId: userId.toString(),
      pokemonId,
      firstTimeCaught: new Date()
    });
    await discovery.save();

    // Add starter items to inventory (5 Poke Balls)
    const pokeBallItem = await Inventory.findOne({
      userId,
      itemId: 'poke_ball'
    });

    if (pokeBallItem) {
      pokeBallItem.quantity += 5;
      await pokeBallItem.save();
    } else {
      const newInventoryItem = new Inventory({
        userId,
        itemId: 'poke_ball',
        quantity: 5
      });
      await newInventoryItem.save();
    }

    return {
      pokemon: newUserPokemon,
      message: `You received ${pokemon.name}!`
    };
  }
  catch(err) {
    console.error('Error selecting starter Pokemon:', err);
    throw err;
  }
};

export const completeTutorial = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.isNewUser = false;
    user.hasCompletedTutorial = true;
    await user.save();

    return {
      success: true,
      message: 'Tutorial completed successfully'
    };
  }
  catch(err) {
    console.error('Error completing tutorial:', err);
    throw err;
  }
};

// STATISTICS FUNCTIONS
export const getPokemonCount = async (userId) => {
  try {
    const count = await UserPokemon.countDocuments({ userId: userId.toString() });
    return { count };
  }
  catch(err) {
    console.error('Error counting user pokemon:', err);
    throw err;
  }
};

export const getDiscoveryCount = async (userId) => {
  try {
    const count = await UserDiscovery.countDocuments({ userId: userId.toString() });
    return { count };
  }
  catch(err) {
    console.error('Error counting user discoveries:', err);
    throw err;
  }
};