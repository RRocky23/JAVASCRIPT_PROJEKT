import User from '../models/User.js';
import UserPokemon from '../models/UserPokemon.js';
import Pokemon from '../models/Pokemon.js';
import PokemonSprite from '../models/PokemonSprite.js';
import { calculatePokemonValue } from '../config/exchangeConfig.js';
import mongoose from 'mongoose';

/**
 * Get current user's currency balance
 */
export const getCurrencyBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('currency');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ currency: user.currency });
  } catch (err) {
    console.error('Error fetching currency balance:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get list of user's Pokemon with their exchange values
 */
export const getExchangeablePokemon = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user's Pokemon
    const userPokemons = await UserPokemon.find({ userId }).lean();

    if (userPokemons.length === 0) {
      return res.status(200).json([]);
    }

    // Get Pokemon details
    const pokemonIds = [...new Set(userPokemons.map(up => up.pokemonId))];
    const pokemons = await Pokemon.find({ pokedexNumber: { $in: pokemonIds } }).lean();
    const sprites = await PokemonSprite.find({ pokedexNumber: { $in: pokemonIds } }).lean();

    // Create maps for quick lookup
    const pokemonMap = Object.fromEntries(
      pokemons.map(p => [p.pokedexNumber, p])
    );
    const spriteMap = Object.fromEntries(
      sprites.map(s => [s.pokedexNumber, s])
    );

    // Calculate values for each user Pokemon
    const exchangeablePokemons = userPokemons.map(userPokemon => {
      const pokemon = pokemonMap[userPokemon.pokemonId];
      const sprite = spriteMap[userPokemon.pokemonId];
      const value = calculatePokemonValue(pokemon, userPokemon);

      return {
        _id: userPokemon._id,
        pokemonId: userPokemon.pokemonId,
        name: pokemon?.name || 'Unknown',
        customName: userPokemon.customName,
        level: userPokemon.level,
        sprite: sprite?.pokedexFrontSprite || null,
        isLegendary: pokemon?.isLegendary || false,
        isMythical: pokemon?.isMythical || false,
        isFavourite: userPokemon.isFavourite,
        exchangeValue: value,
        typeOne: pokemon?.typeOne,
        typeTwo: pokemon?.typeTwo
      };
    });

    return res.status(200).json(exchangeablePokemons);
  } catch (err) {
    console.error('Error fetching exchangeable Pokemon:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Exchange Pokemon for currency
 */
export const exchangePokemons = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { pokemonIds } = req.body;

    // Validation
    if (!pokemonIds || !Array.isArray(pokemonIds) || pokemonIds.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Pokemon IDs array is required' });
    }

    // Convert to ObjectIds
    const objectIds = pokemonIds.map(id => new mongoose.Types.ObjectId(id));

    // Get user's Pokemon
    const userPokemons = await UserPokemon.find({
      _id: { $in: objectIds },
      userId
    }).session(session).lean();

    if (userPokemons.length !== pokemonIds.length) {
      await session.abortTransaction();
      return res.status(404).json({
        message: 'Some Pokemon not found or do not belong to this user'
      });
    }

    // Get Pokemon details for value calculation
    const pokemonDetailsIds = [...new Set(userPokemons.map(up => up.pokemonId))];
    const pokemons = await Pokemon.find({
      pokedexNumber: { $in: pokemonDetailsIds }
    }).session(session).lean();

    const pokemonMap = Object.fromEntries(
      pokemons.map(p => [p.pokedexNumber, p])
    );

    // Calculate total value
    let totalValue = 0;
    const exchangeDetails = userPokemons.map(userPokemon => {
      const pokemon = pokemonMap[userPokemon.pokemonId];
      const value = calculatePokemonValue(pokemon, userPokemon);
      totalValue += value;

      return {
        _id: userPokemon._id,
        name: pokemon?.name || 'Unknown',
        level: userPokemon.level,
        value
      };
    });

    // Delete the Pokemon
    await UserPokemon.deleteMany({
      _id: { $in: objectIds }
    }).session(session);

    // Add currency to user
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { currency: totalValue } },
      { new: true, session }
    ).select('currency');

    // Commit transaction
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      totalValue,
      newBalance: user.currency,
      exchangedCount: userPokemons.length,
      details: exchangeDetails
    });

  } catch (err) {
    await session.abortTransaction();
    console.error('Error exchanging Pokemon:', err);
    return res.status(500).json({ message: 'Server error' });
  } finally {
    session.endSession();
  }
};

/**
 * Calculate value for specific Pokemon (preview)
 */
export const calculateValue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pokemonIds } = req.body;

    if (!pokemonIds || !Array.isArray(pokemonIds) || pokemonIds.length === 0) {
      return res.status(400).json({ message: 'Pokemon IDs array is required' });
    }

    const objectIds = pokemonIds.map(id => new mongoose.Types.ObjectId(id));

    // Get user's Pokemon
    const userPokemons = await UserPokemon.find({
      _id: { $in: objectIds },
      userId
    }).lean();

    if (userPokemons.length === 0) {
      return res.status(404).json({ message: 'No Pokemon found' });
    }

    // Get Pokemon details
    const pokemonDetailsIds = [...new Set(userPokemons.map(up => up.pokemonId))];
    const pokemons = await Pokemon.find({
      pokedexNumber: { $in: pokemonDetailsIds }
    }).lean();

    const pokemonMap = Object.fromEntries(
      pokemons.map(p => [p.pokedexNumber, p])
    );

    // Calculate values
    let totalValue = 0;
    const values = userPokemons.map(userPokemon => {
      const pokemon = pokemonMap[userPokemon.pokemonId];
      const value = calculatePokemonValue(pokemon, userPokemon);
      totalValue += value;

      return {
        pokemonId: userPokemon._id,
        name: pokemon?.name || 'Unknown',
        value
      };
    });

    return res.status(200).json({
      totalValue,
      count: userPokemons.length,
      values
    });

  } catch (err) {
    console.error('Error calculating value:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
