function stat(base, level) {
  return Math.floor(
    base * (1 + level / 50) * rand(0.9, 1.1)
  );
}

function hp(base, level) {
  return Math.floor(base + level * 2 + rand(0, 10));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function calculateStats(baseStats, level) {
  return {
    maxHp: hp(baseStats.hp, level),
    maxPp: Math.floor(100 + level * rand(0, 2)),
    height: (baseStats.height * rand(0.70, 1.30)).toFixed(2),
    weight: (baseStats.weight * Math.pow(rand(0.70, 1.39), 3)).toFixed(2),
    attack: stat(baseStats.attack, level),
    defense: stat(baseStats.defense, level),
    specialAttack: stat(baseStats.specialAttack, level),
    specialDefense: stat(baseStats.specialDefense, level),
    speed: stat(baseStats.speed, level)
  };
}
