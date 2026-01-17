export function weightedRandomPokemon(pokemons) {
  if (!pokemons || pokemons.length === 0) {
    throw new Error("No pokemon available for selection");
  }

  const pokemonWithWeights = pokemons.map((pokemon) => {
    let weight = 100;

    if (pokemon.evolutionStage === 2) weight *= 0.4;
    if (pokemon.evolutionStage === 3) weight *= 0.2;

    if (pokemon.isLegendary) weight *= 0.05;
    if (pokemon.isMythical) weight *= 0.03;

    return { pokemon, weight };
  });

  const totalWeight = pokemonWithWeights.reduce((sum, { weight }) => sum + weight, 0);
  
  let random = Math.random() * totalWeight;

  for (const { pokemon, weight } of pokemonWithWeights) {
    random -= weight;
    if (random <= 0) {
      return pokemon;
    }
  }

  return pokemonWithWeights[0].pokemon;
}