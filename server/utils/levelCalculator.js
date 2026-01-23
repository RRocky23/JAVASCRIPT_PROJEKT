function rand(min, max) {
    return Math.max(min, Math.floor(Math.random() * (max - min + 1)) + min);
}

export function calculateLevel(pokemon, allPokemon) {
    if (pokemon.isLegendary || pokemon.isMythical) {
        return rand(50, 120);
    }

    if (pokemon.evolutionStage === 1) {
        const nextStage = allPokemon.find(p => p.evolutionChainId === pokemon.evolutionChainId && p.evolutionStage === 2 && p.evolvesFrom === pokemon.name);
        
        if (nextStage && nextStage.evolutionMinLevel > 1) {
            return rand(1, nextStage.evolutionMinLevel - 1);
        }
      
        return rand(1, 30);
    }

    if (pokemon.evolutionStage === 2) {
        const nextStage = allPokemon.find(p => p.evolutionChainId === pokemon.evolutionChainId && p.evolutionStage === 3 && p.evolvesFrom === pokemon.name);
      
        const minLevel = pokemon.evolutionMinLevel || 1;
      
        if (nextStage && nextStage.evolutionMinLevel > minLevel) {
            return rand(minLevel, nextStage.evolutionMinLevel - 1);
        }
      
        return rand(minLevel, 70);
    }

    if (pokemon.evolutionStage === 3) {
        const minLevel = pokemon.evolutionMinLevel || 1;
        return rand(minLevel, 100);
    }

    return rand(1, 100);
}