function rand(min, max) {
  return Math.max(min, Math.floor(Math.random() * (max - min + 1)) + min);
}

export function calculateLevel(pokemon, allPokemon) {
  if(pokemon.isLegendary || pokemon.isMythical) {
    return rand(20, 50);
  }

  if(pokemon.evolutionStage === 1) {
    return rand(1, pokemon.evolutionMinLevel - 1);
  }

  const prevStage = allPokemon.find(p => p.evolutionChainId === pokemon.evolutionChainId && p.evolutionStage === pokemon.evolutionStage - 1);

  if(!prevStage) {
    return rand(1, pokemon.evolutionMinLevel - 1);
  }

  if(pokemon.evolutionStage === 2) {
    return rand(prevStage.evolutionMinLevel, pokemon.evolutionMinLevel - 1);
  }

  return rand(
    prevStage.evolutionMinLevel,
    prevStage.evolutionMinLevel + 20
  );
}
