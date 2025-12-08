import Pokedex from "pokedex-promise-v2";
import Pokemon from "../models/Pokemon.js";
import PokemonStat from "../models/PokemonStat.js";
import PokemonDescription from "../models/PokemonDescription.js";
import PokemonSprite from "../models/PokemonSprite.js";
import PokemonMove from "../models/PokemonMove.js";
import LearnByPokemon from "../models/LearnByPokemon.js";
import PokemonEvolution from "../models/PokemonEvolution.js";
import Item from "../models/Item.js";

const pokedex = new Pokedex();

const getEvolutionDetails = async (evolutionChainUrl) => {
    try {
        const chainId = evolutionChainUrl.split('/').filter(Boolean).pop();
        const chain = await pokedex.getEvolutionChainById(chainId);

        const evolutionMap = new Map();
        const evolutionLinks = [];

        const traverseChain = (chainLink, stage = 1, evolvesFrom = null) => {
            const speciesName = chainLink.species.name;
            const speciesId = parseInt(chainLink.species.url.split('/').filter(Boolean).pop());
            const minLevel = chainLink.evolution_details[0]?.min_level || 0;
            const trigger = chainLink.evolution_details[0]?.trigger?.name || null;
            const item = chainLink.evolution_details[0]?.item?.name || null;

            evolutionMap.set(speciesName, {
                evolutionChainId: parseInt(chainId),
                evolutionStage: stage,
                evolvesFrom: evolvesFrom || null,
                evolutionMinLevel: minLevel
            });

            if(evolvesFrom) {
                const evolvesFromId = parseInt(chainLink.evolution_details[0]?.species?.url?.split('/').filter(Boolean).pop() || 0);
                evolutionLinks.push({
                    pokemonId: evolvesFromId,
                    evolvesToPokemonId: speciesId,
                    minLevel: minLevel,
                    evolutionTrigger: trigger,
                    triggerItem: item,
                    conditions: JSON.stringify(chainLink.evolution_details[0] || {})
                });
            }

            chainLink.evolves_to.forEach(evo =>
                traverseChain(evo, stage + 1, speciesName)
            );
        };

        traverseChain(chain.chain);
        return { evolutionMap, evolutionLinks };

    }catch(err) {
        console.error('Error fetching evolution chain:', err.message);
        return { evolutionMap: new Map(), evolutionLinks: [] };
    }
};

const pokemonDataSeeder = async () => {
    try {
        console.log('Checking for missing Pokémon...');

        const existing = await Pokemon.find({}, { pokedexNumber: 1 });
        const existingIds = new Set(existing.map(p => p.pokedexNumber));

        const missingIds = [];
        for(let id = 1; id <= 151; id++) {
            if(!existingIds.has(id)) {
                missingIds.push(id);
            }
        }

        if(missingIds.length === 0) {
            console.log('All Pokémon already exist. No seeding needed.');
            return;
        }

        console.log(`Missing Pokémon IDs: ${missingIds.join(", ")}`);
        console.log(`Seeding ${missingIds.length} missing Pokémon...\n`);

        for(const id of missingIds) {
            try {
                console.log(`Fetching Pokémon #${id}...`);

                const pokemon = await pokedex.getPokemonByName(id);
                const species = await pokedex.getPokemonSpeciesByName(id);
                const { evolutionMap } = await getEvolutionDetails(species.evolution_chain.url);

                const evolutionData = evolutionMap.get(pokemon.name) || {
                    evolutionChainId: 0,
                    evolutionStage: 1,
                    evolvesFrom: null,
                    evolutionMinLevel: 0
                };

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
                    generation: 1
                };

                await Pokemon.create(pokemonData);
                console.log(`Added ${pokemon.name}`);
                await new Promise(res => setTimeout(res, 150));

            }catch(err) {
                console.error(`Error processing Pokémon #${id}:`, err.message);
            }
        }

        console.log('\nPokémon seeding complete!');

    }catch(err) {
        console.error("Seeder error:", err);
        throw err;
    }
};

const pokemonStatSeeder = async () => {
    try {
        console.log('Checking for missing Pokémon stats...');

        const existing = await PokemonStat.find({}, { pokemonId: 1 });
        const existingIds = new Set(existing.map(p => p.pokemonId));

        const missingIds = [];
        for(let id = 1; id <= 151; id++) {
            if(!existingIds.has(id)) {
                missingIds.push(id);
            }
        }

        if(missingIds.length === 0) {
            console.log('All Pokémon stats already exist. No seeding needed.');
            return;
        }

        console.log(`Seeding ${missingIds.length} missing Pokémon stats...\n`);

        for(const id of missingIds) {
            try {
                const pokemon = await pokedex.getPokemonByName(id);
                const species = await pokedex.getPokemonSpeciesByName(id);

                const stats = {};
                pokemon.stats.forEach(stat => {
                    const statName = stat.stat.name
                        .replace('special-attack', 'specialAttack')
                        .replace('special-defense', 'specialDefense');
                    stats[statName] = stat.base_stat;
                });

                const statData = {
                    pokemonId: pokemon.id,
                    hp: stats.hp,
                    attack: stats.attack,
                    defense: stats.defense,
                    specialAttack: stats.specialAttack,
                    specialDefense: stats.specialDefense,
                    speed: stats.speed,
                    baseExperience: pokemon.base_experience || 0,
                    catchRate: species.capture_rate || 0,
                };

                await PokemonStat.create(statData);
                console.log(`Added stats for Pokémon #${id}`);
                await new Promise(res => setTimeout(res, 150));

            }catch(err) {
                console.error(`Error processing stats for Pokémon #${id}:`, err.message);
            }
        }

        console.log('\nPokémon stat seeding complete!');

    }catch(err) {
        console.error("Stat seeder error:", err);
        throw err;
    }
};

const pokemonDescriptionSeeder = async () => {
    try {
        console.log('Checking for missing Pokémon descriptions...');

        const existing = await PokemonDescription.find({}, { pokedexNumber: 1 });
        const existingIds = new Set(existing.map(p => p.pokedexNumber));

        const missingIds = [];
        for(let id = 1; id <= 151; id++) {
            if(!existingIds.has(id)) {
                missingIds.push(id);
            }
        }

        if(missingIds.length === 0) {
            console.log('All Pokémon descriptions already exist. No seeding needed.');
            return;
        }

        console.log(`Seeding ${missingIds.length} missing Pokémon descriptions...\n`);

        for(const id of missingIds) {
            try {
                const species = await pokedex.getPokemonSpeciesByName(id);

                const englishDescriptions = species.flavor_text_entries
                    .filter(entry => entry.language.name === 'en')
                    .map(entry => entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' '))
                    .filter((desc, index, self) => self.indexOf(desc) === index);

                if(englishDescriptions.length === 0) {
                    englishDescriptions.push('No description available.');
                }

                for(const description of englishDescriptions) {
                    const descriptionData = {
                        pokedexNumber: id,
                        description: description
                    };

                    await PokemonDescription.create(descriptionData);
                }

                console.log(`Added ${englishDescriptions.length} descriptions for Pokémon #${id}`);
                await new Promise(res => setTimeout(res, 150));

            }catch(err) {
                console.error(`Error processing description for Pokémon #${id}:`, err.message);
            }
        }

        console.log('\nPokémon description seeding complete!');

    }catch(err) {
        console.error("Description seeder error:", err);
        throw err;
    }
};

const pokemonSpriteSeeder = async () => {
    try {
        console.log('Checking for missing Pokémon sprites...');

        const existing = await PokemonSprite.find({}, { pokedexNumber: 1 });
        const existingIds = new Set(existing.map(p => p.pokedexNumber));

        const missingIds = [];
        for(let id = 1; id <= 151; id++) {
            if(!existingIds.has(id)) {
                missingIds.push(id);
            }
        }

        if(missingIds.length === 0) {
            console.log('All Pokémon sprites already exist. No seeding needed.');
            return;
        }

        console.log(`Seeding ${missingIds.length} missing Pokémon sprites...\n`);

        for(const id of missingIds) {
            try {
                const pokemon = await pokedex.getPokemonByName(id);

                const spriteData = {
                    pokedexNumber: pokemon.id,
                    frontSprite: pokemon.sprites.versions['generation-vi']['x-y'].front_default || '',
                    shinySprite: pokemon.sprites.versions['generation-vi']['x-y'].front_shiny || '',
                    pokedexFrontSprite: pokemon.sprites.versions['generation-v']['black-white'].front_default || '',
                    pokedexBackSprite: pokemon.sprites.versions['generation-v']['black-white'].back_default || '',
                    pokedexAnimatedSprite: pokemon.sprites.versions['generation-v']['black-white']['animated'].front_default || '',
                    evolutionSprite: pokemon.sprites.versions['generation-vii']['icons'].front_default || ''
                };

                await PokemonSprite.create(spriteData);
                console.log(`Added sprites for Pokémon #${id}`);
                await new Promise(res => setTimeout(res, 150));

            }catch(err) {
                console.error(`Error processing sprites for Pokémon #${id}:`, err.message);
            }
        }

        console.log('\nPokémon sprite seeding complete!');

    }catch(err) {
        console.error("Sprite seeder error:", err);
        throw err;
    }
};

const pokemonMoveSeeder = async () => {
    try {
        console.log('Checking for missing Pokémon moves (Gen 1)...');

        const gen1Moves = await pokedex.getGenerationByName(1);
        const moveNames = gen1Moves.moves.map(m => m.name);

        const existing = await PokemonMove.find({}, { moveName: 1 });
        const existingMoves = new Set(existing.map(m => m.moveName));

        const missingMoves = moveNames.filter(name => !existingMoves.has(name));

        if(missingMoves.length === 0) {
            console.log('All Gen 1 moves already exist. No seeding needed.');
            return;
        }

        console.log(`Seeding ${missingMoves.length} missing moves...\n`);

        for(const moveName of missingMoves) {
            try {
                const move = await pokedex.getMoveByName(moveName);

                const englishDescription = move.flavor_text_entries
                    .find(entry => entry.language.name === 'en')?.flavor_text
                    .replace(/\f/g, ' ') || 'No description available.';

                const learnMethod = move.learned_by_pokemon.length > 0 ? 'level-up' : 'unknown';

                const moveData = {
                    moveName: move.name,
                    moveType: move.type.name,
                    power: move.power || 0,
                    accuracy: move.accuracy || 100,
                    pp: move.pp || 0,
                    damageClass: move.damage_class.name,
                    description: englishDescription,
                    learnMethod: learnMethod,
                    learnLevel: 0
                };

                await PokemonMove.create(moveData);
                console.log(`Added move: ${move.name}`);
                await new Promise(res => setTimeout(res, 150));

            }catch(err) {
                console.error(`Error processing move ${moveName}:`, err.message);
            }
        }

        console.log('\nMove seeding complete!');

    }catch(err) {
        console.error("Move seeder error:", err);
        throw err;
    }
};

const learnByPokemonSeeder = async () => {
    try {
        console.log('Checking for missing Pokémon-Move relationships...');

        const existingCount = await LearnByPokemon.countDocuments();

        if(existingCount > 0) {
            console.log('Pokémon-Move relationships already exist. No seeding needed.');
            return;
        }

        console.log('Seeding Pokémon-Move relationships...\n');

        for(let id = 1; id <= 151; id++) {
            try {
                const pokemon = await pokedex.getPokemonByName(id);

                for(const moveData of pokemon.moves) {
                    const moveName = moveData.move.name;
                    const versionDetails = moveData.version_group_details.find(
                        v => v.version_group.name === 'red-blue'
                    );

                    if(versionDetails) {
                        const learnData = {
                            pokedexNumber: id,
                            moveName: moveName
                        };

                        await LearnByPokemon.create(learnData);
                    }
                }

                console.log(`Added move relationships for Pokémon #${id}`);
                await new Promise(res => setTimeout(res, 150));

            }catch(err) {
                console.error(`Error processing move relationships for Pokémon #${id}:`, err.message);
            }
        }

        console.log('\nPokémon-Move relationship seeding complete!');

    }catch(err) {
        console.error("Learn by Pokémon seeder error:", err);
        throw err;
    }
};

const pokemonEvolutionSeeder = async () => {
    try {
        console.log('Checking for missing evolution data...');

        const existingCount = await PokemonEvolution.countDocuments();

        if(existingCount > 0) {
            console.log('Evolution data already exists. No seeding needed.');
            return;
        }

        console.log('Seeding evolution data...\n');

        const processedChains = new Set();

        for(let id = 1; id <= 151; id++) {
            try {
                const species = await pokedex.getPokemonSpeciesByName(id);
                const chainId = species.evolution_chain.url.split('/').filter(Boolean).pop();

                if(processedChains.has(chainId)) {
                    continue;
                }
                processedChains.add(chainId);

                const { evolutionLinks } = await getEvolutionDetails(species.evolution_chain.url);

                for(const link of evolutionLinks) {
                    if(link.pokemonId <= 151 && link.evolvesToPokemonId <= 151) {
                        await PokemonEvolution.create(link);
                        console.log(`Added evolution: ${link.pokemonId} -> ${link.evolvesToPokemonId}`);
                    }
                }

                await new Promise(res => setTimeout(res, 150));

            }catch(err) {
                console.error(`Error processing evolution for Pokémon #${id}:`, err.message);
            }
        }

        console.log('\nEvolution data seeding complete!');

    }catch(err) {
        console.error("Evolution seeder error:", err);
        throw err;
    }
};

const itemSeeder = async () => {
    try {
        console.log('Checking for missing items...');

        const existingCount = await Item.countDocuments();

        if(existingCount > 0) {
            console.log('Items already exist. No seeding needed.');
            return;
        }

        console.log('Seeding items...\n');

        const itemNames = [
            'poke-ball',
            'great-ball',
            'ultra-ball',
            'master-ball',
            'potion',
            'super-potion',
            'hyper-potion',
            'max-potion',
            'revive',
            'max-revive'
        ];

        const categoryMap = {
            'poke-ball': 'pokeball',
            'great-ball': 'pokeball',
            'ultra-ball': 'pokeball',
            'master-ball': 'pokeball',
            'potion': 'potion',
            'super-potion': 'potion',
            'hyper-potion': 'potion',
            'max-potion': 'potion',
            'revive': 'revive',
            'max-revive': 'revive'
        };

        const strengthMap = {
            'poke-ball': 1,
            'great-ball': 1.5,
            'ultra-ball': 2,
            'master-ball': 255,
            'potion': 20,
            'super-potion': 50,
            'hyper-potion': 200,
            'max-potion': 999,
            'revive': 50,
            'max-revive': 100
        };

        for(const itemName of itemNames) {
            try {
                const item = await pokedex.getItemByName(itemName);

                const englishEffect = item.effect_entries
                    .find(entry => entry.language.name === 'en')?.effect || 'No effect description available.';

                const itemData = {
                    itemName: item.name,
                    itemType: categoryMap[item.name] || 'other',
                    effect: englishEffect,
                    strength: strengthMap[item.name] || 0,
                    sprite: item.sprites.default || '',
                    price: item.cost || 0
                };

                await Item.create(itemData);
                console.log(`Added item: ${item.name}`);
                await new Promise(res => setTimeout(res, 150));

            }catch(err) {
                console.error(`Error processing item ${itemName}:`, err.message);
            }
        }

        console.log('\nItem seeding complete!');

    }catch(err) {
        console.error("Item seeder error:", err);
        throw err;
    }
};

const runPokemonDataSeeders = async () => {
    try {
        await pokemonDataSeeder();
        await pokemonStatSeeder();
        await pokemonDescriptionSeeder();
        await pokemonSpriteSeeder();
        await pokemonMoveSeeder();
        await learnByPokemonSeeder();
        await pokemonEvolutionSeeder();
        await itemSeeder();
        console.log('\n=== All seeders completed successfully! ===');
    }catch(err) {
        console.error("Error running seeders:", err);
        throw err;
    }
};

export {
    pokemonDataSeeder,
    pokemonStatSeeder,
    pokemonDescriptionSeeder,
    pokemonSpriteSeeder,
    pokemonMoveSeeder,
    learnByPokemonSeeder,
    pokemonEvolutionSeeder,
    itemSeeder,
    runPokemonDataSeeders
};

export default runPokemonDataSeeders;