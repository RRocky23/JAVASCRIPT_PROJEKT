import mongoose, { Schema } from "mongoose";

const pokemonEvolutionSchema = new Schema({
    pokemonId: {
        type: Number,
        required: true
    },
    evolvesToPokemonId: {
        type: Number,
        required: true
    },
    minLevel: {
        type: Number,
        required: true
    },
    evolutionTrigger: {
        type: String,
        required: false
    },
    triggerItem: {
        type: String,
        required: false
    },
    conditions: {
        type: String,
        required: true
    }
});

const PokemonEvolution = mongoose.model("PokemonEvolution", pokemonEvolutionSchema);
export default PokemonEvolution;