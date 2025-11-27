import Pokedex from "pokedex-promise-v2";

import Pokemon from "../models/Pokemon.js";

const pokedex = new Pokedex();

const getEvolutionDetails = async (evolutionChainUrl) => {
    try {
        const chainId = evolutionChainUrl.split('/').filter(Boolean).pop();
        const chain = await pokedex.getEvolutionChainById(chainId);

        const evolutionMap = new Map();

        const traverseChain = (chainLink, stage = 1, evolvesFrom = null) => {
            const speciesName = chainLink.species.name;
            const minLevel = chainLink.evolution_details[0]?.min_level || 0;

            evolutionMap.set(speciesName, {
                evolutionChainId: parseInt(chainId),
                evolutionStage: stage,
                evolvesFrom: evolvesFrom || null,
                evolutionMinLevel: minLevel
            });

            chainLink.evolves_to.forEach(evo =>
                traverseChain(evo, stage + 1, speciesName)
            );
        };

        traverseChain(chain.chain);
        return evolutionMap;

    }catch(err) {
        console.error('Error fetching evolution chain:', err.message);
        return new Map();
    }
};

const pokemonDataSeeder = async () => {
    try {
        console.log('Checking for missing Pokémon...');

        const existing = await Pokemon.find({}, { pokedexNumber: 1});
        const existingIds = new Set(existing.map(p => p.pokedexNumber));

        const missingIds = [];

        for(let id = 1; id <= 151; id++) {
            if (!existingIds.has(id)) missingIds.push(id);
        }

        if(missingIds.length === 0) {
            console.log('All Pokémons already exist. No seeding needed.');
            return;
        }

        console.log(`Missing Pokémon IDs: ${missingIds.join(", ")}`);
        console.log(`Seeding ${missingIds.length} missing Pokémons...\n`);

        for(const id of missingIds) {
            try {
                console.log(`Fetching Pokémon #${id}...`);

                const pokemon = await pokedex.getPokemonByName(id);
                const species = await pokedex.getPokemonSpeciesByName(id);

                const evolutionMap = await getEvolutionDetails(species.evolution_chain.url);
                const evolutionData = evolutionMap.get(pokemon.name) || {
                    evolutionChainId: 0,
                    evolutionStage: 1,
                    evolvesFrom: null,
                    evolutionMinLevel: 0
                };

                const englishDescription =
                    species.flavor_text_entries
                        .find(entry => entry.language.name === 'en')
                        ?.flavor_text.replace(/\f|\n/g, " ") || 'No description available';

                const pokemonData = {
                    pokedexNumber: pokemon.id,
                    name: pokemon.name,
                    typeOne: pokemon.types[0].type.name,
                    typeTwo: pokemon.types[1]?.type.name || null,
                    height: pokemon.height,
                    weight: pokemon.weight,
                    color: species.color?.name || 'unknown',
                    habitat: species.habitat?.name || 'unknown',
                    shape: species.shape?.name || 'unknown',
                    isLegendary: species.is_legendary,
                    isMythical: species.is_mythical,
                    evolutionChainId: evolutionData.evolutionChainId,
                    evolutionStage: evolutionData.evolutionStage,
                    evolvesFrom: evolutionData.evolvesFrom,
                    evolutionMinLevel: evolutionData.evolutionMinLevel,
                    spriteURL: pokemon.sprites.front_default || '',
                    description: englishDescription,
                    generation: 1
                };

                await Pokemon.create(pokemonData);

                console.log(`Added ${pokemon.name}`);
                await new Promise(res => setTimeout(res, 150));0

            } catch (err) {
                console.error(`Error processing Pokémon #${id}:`, err.message);
            }
        }

        console.log('\nPokémon eeding complete!');

    } catch (err) {
        console.error("Seeder error:", err);
        throw err;
    }
};

export default pokemonDataSeeder;