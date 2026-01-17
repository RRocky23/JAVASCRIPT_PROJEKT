import { SPAWN_AREAS } from "../config/mapConfig.js";
import { getWeatherBoosts } from "./weather.js";
import { worldPokemon } from "./worldState.js";
import { spawnPokemonInstance } from "./spawnPokemon.js";

import Pokemon from "../models/Pokemon.js";

const MAX_POKEMON = 300;
const SPAWN_INTERVAL = 30000;
const SPAWN_VARIANCE = 15000;
const POKEMON_LIFETIME = 600000;
const LIFETIME_VARIANCE = 180000;
const MIN_DISTANCE_BETWEEN_POKEMON = 0.0001;

let spawnTimer = null;
let io = null;

export function initSpawnManager(socketIO) {
  io = socketIO;
}

function getMaxPokemonForArea(area) {
  return Math.floor((area.Percent / 100) * MAX_POKEMON);
}

function getRandomPointInPolygon(coordinates) {
  const bounds = coordinates.reduce(
    (acc, [lat, lng]) => ({
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng),
    }),
    { minLat: Infinity, maxLat: -Infinity, minLng: Infinity, maxLng: -Infinity }
  );

  let attempts = 0;
  const maxAttempts = 100;

  while(attempts < maxAttempts) {
    const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
    const lng = bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng);

    if(isPointInPolygon([lat, lng], coordinates)) {
      return [lat, lng];
    }
    attempts++;
  }

  return [
    (bounds.minLat + bounds.maxLat) / 2,
    (bounds.minLng + bounds.maxLng) / 2,
  ];
}

function isPointInPolygon(point, polygon) {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function isTooClose(lat, lng, areaId) {
  for (const [id, pokemon] of worldPokemon.entries()) {
    if (pokemon.areaId !== areaId) continue;

    const distance = Math.sqrt(
      Math.pow(pokemon.lat - lat, 2) + Math.pow(pokemon.lng - lng, 2)
    );

    if(distance < MIN_DISTANCE_BETWEEN_POKEMON) {
      return true;
    }
  }
  return false;
}

function getValidSpawnPoint(area) {
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    const [lat, lng] = getRandomPointInPolygon(area.coordinates);

    if (!isTooClose(lat, lng, area.id)) {
      return [lat, lng];
    }
    attempts++;
  }

  return getRandomPointInPolygon(area.coordinates);
}

async function selectPokemonForArea(area, weatherBoosts) {
  const allPokemon = await Pokemon.find();

  let eligiblePokemon = allPokemon;
  if(area.Name !== "Main Campus") {
    eligiblePokemon = allPokemon.filter((p) =>
      area.Types.includes(p.typeOne) || (p.typeTwo && area.Types.includes(p.typeTwo))
    );
  }

  const pokemonWithWeights = eligiblePokemon.map((p) => {
    let weight = 100;

    if (p.evolutionStage === 2) weight *= 0.4;
    if (p.evolutionStage === 3) weight *= 0.2;

    if (p.isLegendary) weight *= 0.05;
    if (p.isMythical) weight *= 0.03;

    if(area.Name === "Main Campus") {
      const hasWeatherBoost = weatherBoosts.includes(p.typeOne) ||  (p.typeTwo && weatherBoosts.includes(p.typeTwo));
      if (hasWeatherBoost) weight *= 2.5;
    }

    return { pokemon: p, weight };
  });

  const totalWeight = pokemonWithWeights.reduce((sum, { weight }) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for(const { pokemon, weight } of pokemonWithWeights) {
    random -= weight;
    if (random <= 0) return pokemon;
  }

  return pokemonWithWeights[0].pokemon;
}

function generatePokemonId() {
  return `pokemon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function scheduleDespawn(pokemonId) {
  const variance = Math.random() * LIFETIME_VARIANCE * 2 - LIFETIME_VARIANCE;
  const lifetime = POKEMON_LIFETIME + variance;

  setTimeout(() => {
    const pokemon = worldPokemon.get(pokemonId);
    if (pokemon && !pokemon.caught) {
      worldPokemon.delete(pokemonId);
      if (io) {
        io.emit("pokemon:despawn", pokemonId);
      }
      console.log(`Pokemon ${pokemonId} despawned`);
    }
  }, lifetime);
}

async function spawnSinglePokemon() {
  try {
    if (worldPokemon.size >= MAX_POKEMON) {
      return;
    }

    const totalPercent = SPAWN_AREAS.reduce((sum, area) => sum + area.Percent, 0);
    let random = Math.random() * totalPercent;

    let selectedArea = SPAWN_AREAS[0];
    for (const area of SPAWN_AREAS) {
      random -= area.Percent;
      if (random <= 0) {
        selectedArea = area;
        break;
      }
    }

    const currentInArea = Array.from(worldPokemon.values()).filter(
      (p) => p.areaId === selectedArea.id
    ).length;
    const maxInArea = getMaxPokemonForArea(selectedArea);

    if (currentInArea >= maxInArea) {
      return;
    }

    const weatherBoosts = getWeatherBoosts();
    const selectedPokemon = await selectPokemonForArea(selectedArea, weatherBoosts);
    const [lat, lng] = getValidSpawnPoint(selectedArea);
    const pokemonInstance = await spawnPokemonInstance(selectedPokemon);

    const worldPokemonData = {
      ...pokemonInstance,
      id: generatePokemonId(),
      lat,
      lng,
      areaId: selectedArea.id,
      areaName: selectedArea.Name,
      caught: false,
      caughtBy: []
    };

    worldPokemon.set(worldPokemonData.id, worldPokemonData);

    if(io) {
      io.emit("pokemon:spawn", worldPokemonData);
    }

    scheduleDespawn(worldPokemonData.id);

    console.log(`Spawned ${worldPokemonData.name} (${worldPokemonData.id}) in ${selectedArea.Name}`);
  } 
  catch (error) {
    console.error("Error spawning pokemon:", error);
  }
}

export function startSpawnLoop() {
  if (spawnTimer) {
    clearInterval(spawnTimer);
  }

  const initialSpawnCount = Math.floor(MAX_POKEMON * 0.5);
  for (let i = 0; i < initialSpawnCount; i++) {
    setTimeout(() => spawnSinglePokemon(), i * 500);
  }

  spawnTimer = setInterval(() => {
    const variance = Math.random() * SPAWN_VARIANCE * 2 - SPAWN_VARIANCE;
    setTimeout(() => spawnSinglePokemon(), variance);
  }, SPAWN_INTERVAL);

  console.log("Spawn loop started");
}

export function stopSpawnLoop() {
  if(spawnTimer) {
    clearInterval(spawnTimer);
    spawnTimer = null;
    console.log("Spawn loop stopped");
  }
}

export function getActivePokemon() {
  return Array.from(worldPokemon.values()).filter(p => !p.caught);
}

export function markPokemonAsCaught(pokemonId, userId) {
  const pokemon = worldPokemon.get(pokemonId);
  if (!pokemon) return false;

  if (!pokemon.caughtBy.includes(userId)) {
    pokemon.caughtBy.push(userId);
  }

  return true;
}