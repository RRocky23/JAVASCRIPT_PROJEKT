import Pokemon from "../models/Pokemon.js";
import PokemonStat from "../models/PokemonStat.js";
import PokemonMove from "../models/PokemonMove.js";
import LearnByPokemon from "../models/LearnByPokemon.js";
import PokemonSprite from "../models/PokemonSprite.js";

import { weightedRandomPokemon } from "./pokemonSpawnSelector.js";
import { calculateLevel } from "./levelCalculator.js";
import { calculateStats } from "./statsCalculator.js";
import { selectMoves } from "./movesSelector.js";

export async function spawnPokemonInstance() {
  const pokemons = await Pokemon.find();
  const pokemon = weightedRandomPokemon(pokemons);

  const level = calculateLevel(pokemon, pokemons);
  console.log(level)

  const baseStatsDoc = await PokemonStat.findOne({
    pokemonId: pokemon.pokedexNumber
  });

  const baseStats = {
    ...baseStatsDoc.toObject(),
    weight: pokemon.weight,
    height: pokemon.height
  };

  const sprite = await PokemonSprite.findOne({
    pokedexNumber: pokemon.pokedexNumber
  });

  const moves = await PokemonMove.find();
  const learnTable = await LearnByPokemon.find({
    pokedexNumber: pokemon.pokedexNumber
  });

  return {
    pokemonId: pokemon.pokedexNumber,
    name: pokemon.name,
    types: [pokemon.typeOne, pokemon.typeTwo].filter(Boolean),
    sprite: [sprite.frontSprite, sprite.shinySprite],
    level,
    stats: calculateStats(baseStats, level),
    moves: selectMoves(pokemon, moves, learnTable, level),
    spawnedAt: new Date()
  };
}