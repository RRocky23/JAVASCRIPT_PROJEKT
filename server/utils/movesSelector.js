function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function selectMoves(pokemon, allMoves, learnTable, level) {
  const allowedMoveNames = learnTable.filter(l => l.pokedexNumber === pokemon.pokedexNumber).map(l => l.moveName);

  const usableMoves = allMoves.filter(m =>
      allowedMoveNames.includes(m.moveName) &&
      m.learnLevel <= level
    ).sort((a, b) => b.learnLevel - a.learnLevel).slice(0, 4);

  return usableMoves.map(m => ({
    name: m.moveName,
    type: m.moveType,
    power: m.power,
    accuracy: m.accuracy,
    pp: m.pp,
    damageClass: m.damageClass
  }));
}
