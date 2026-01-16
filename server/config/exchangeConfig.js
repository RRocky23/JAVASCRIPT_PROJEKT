/**
 * Configuration for Pokemon exchange system
 * Defines base currency values for Pokemon based on rarity and level
 */

export const EXCHANGE_CONFIG = {
  // Base values for different rarity types
  BASE_VALUES: {
    COMMON: 10,           // Regular Pokemon
    LEGENDARY: 500,       // Legendary Pokemon
    MYTHICAL: 1000        // Mythical Pokemon
  },

  // Level multiplier (added to base value per level)
  LEVEL_MULTIPLIER: 2,

  // IV bonus (average of all stats, scaled)
  IV_MULTIPLIER: 0.1,

  // Evolution stage bonus
  EVOLUTION_BONUS: {
    1: 0,     // Base form
    2: 20,    // First evolution
    3: 50     // Final evolution
  },

  // Minimum value for any Pokemon
  MIN_VALUE: 5
};

/**
 * Calculate the exchange value for a Pokemon
 * @param {Object} pokemon - The Pokemon base data
 * @param {Object} userPokemon - The user's specific Pokemon instance
 * @returns {number} - The calculated currency value
 */
export const calculatePokemonValue = (pokemon, userPokemon) => {
  if (!pokemon) {
    return EXCHANGE_CONFIG.MIN_VALUE;
  }
  
  let value = 0;

  // Base value based on rarity
  if (pokemon.isMythical) {
    value = EXCHANGE_CONFIG.BASE_VALUES.MYTHICAL;
  } else if (pokemon.isLegendary) {
    value = EXCHANGE_CONFIG.BASE_VALUES.LEGENDARY;
  } else {
    value = EXCHANGE_CONFIG.BASE_VALUES.COMMON;
  }

  // Add level bonus
  value += (userPokemon.level || 1) * EXCHANGE_CONFIG.LEVEL_MULTIPLIER;

  // Add evolution stage bonus
  const evolutionStage = pokemon.evolutionStage || 1;
  value += EXCHANGE_CONFIG.EVOLUTION_BONUS[evolutionStage] || 0;

  // Add IV bonus (average of stats)
  const statAverage = (
    (userPokemon.attack || 0) +
    (userPokemon.defense || 0) +
    (userPokemon.specialAttack || 0) +
    (userPokemon.specialDefense || 0) +
    (userPokemon.speed || 0)
  ) / 5;
  value += Math.floor(statAverage * EXCHANGE_CONFIG.IV_MULTIPLIER);

  // Ensure minimum value
  return Math.max(Math.floor(value), EXCHANGE_CONFIG.MIN_VALUE);
};
