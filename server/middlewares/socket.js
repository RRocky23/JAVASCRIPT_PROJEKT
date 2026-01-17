import pointInPolygon from "point-in-polygon";
import { worldPokemon } from "../utils/worldState.js";
import { GAME_AREA } from "../config/mapConfig.js";
import { markPokemonAsCaught, getActivePokemon } from "../utils/spawnManager.js";
import { initSpawnManager } from "../utils/spawnManager.js";
import UserPokemon from "../models/UserPokemon.js";
import UserDiscovery from "../models/UserDiscovery.js";
import PokemonStat from "../models/PokemonStat.js";

export function initSockets(io) {
  initSpawnManager(io);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("request:pokemon", (userId) => {
      const activePokemon = getActivePokemon().filter(
        (p) => !p.caughtBy.includes(userId)
      );
      socket.emit("pokemon:list", activePokemon);
    });

    socket.on("player:move", (loc) => {
      if (
        !pointInPolygon(
          [loc.lng, loc.lat],
          GAME_AREA.map((p) => [p[1], p[0]])
        )
      ) {
        socket.emit("outside-boundary");
        return;
      }
    });

    socket.on("pokemon:catch", async (data) => {
      try {
        const { pokemonId, userId, ballType, catchLocation } = data;
        
        const pokemon = worldPokemon.get(pokemonId);
        if (!pokemon) {
          socket.emit("pokemon:catch:failed", { 
            error: "Pokemon not found or already despawned" 
          });
          return;
        }

        if (pokemon.caughtBy.includes(userId)) {
          socket.emit("pokemon:catch:failed", { 
            error: "You already caught this pokemon" 
          });
          return;
        }

        const baseStats = await PokemonStat.findOne({
          pokemonId: pokemon.pokemonId
        });

        const catchRate = baseStats.catchRate;
        const ballMultiplier = ballType === "ultra" ? 2 : ballType === "great" ? 1.5 : 1;
        const catchChance = Math.min(((catchRate * ballMultiplier) / 255) * 100, 100);
        const success = Math.random() * 100 < catchChance;

        if (!success) {
          socket.emit("pokemon:catch:failed", { 
            error: "Pokemon broke free!",
            catchChance: Math.round(catchChance)
          });
          return;
        }

        markPokemonAsCaught(pokemonId, userId);

        const userPokemon = new UserPokemon({
          userId,
          pokemonId: pokemon.pokemonId,
          height: pokemon.stats.height || 10,
          weight: pokemon.stats.weight || 10,
          level: pokemon.level,
          experiencePoints: 0,
          currentHp: pokemon.stats.maxHp,
          maxHp: pokemon.stats.maxHp,
          maxPp: pokemon.stats.maxPp,
          attack: pokemon.stats.attack,
          defense: pokemon.stats.defense,
          specialAttack: pokemon.stats.specialAttack,
          specialDefense: pokemon.stats.specialDefense,
          speed: pokemon.stats.speed,
          moveOne: pokemon.moves[0]?.name || "tackle",
          moveTwo: pokemon.moves[1]?.name || "tackle",
          moveThree: pokemon.moves[2]?.name || null,
          moveFour: pokemon.moves[3]?.name || null,
          isFavourite: false,
          caughtDate: new Date(),
          caughtLocationLat: catchLocation.lat,
          caughtLocationLng: catchLocation.lng,
          caughtBallType: ballType || "Poke-ball"
        });

        await userPokemon.save();

        const existingDiscovery = await UserDiscovery.findOne({
          userId,
          pokemonId: pokemon.pokemonId
        });

        if (!existingDiscovery) {
          const discovery = new UserDiscovery({
            userId,
            pokemonId: pokemon.pokemonId,
            firstTimeCaught: new Date()
          });
          await discovery.save();
        }

        socket.emit("pokemon:catch:success", {
          pokemon: userPokemon,
          isNewDiscovery: !existingDiscovery
        });

        console.log(`User ${userId} caught ${pokemon.name} (${pokemonId})`);
      } catch (error) {
        console.error("Error catching pokemon:", error);
        socket.emit("pokemon:catch:failed", { 
          error: "Server error while catching pokemon" 
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}