import mongoose, { Schema } from "mongoose";

const pokemonStatSchema = new Schema ({
    pokemonId: {
        type: Number,
        required: true
    },
    hp: {
        type: Number,
        required: true
    },
    attack: {
        type: Number,
        required: true
    },
    defense: {
        type: Number,
        required: true
    },
    specialAttack: {
        type: Number,
        required: true
    },
    specialDefense: {
        type: Number,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    baseExperience: {
        type: Number,
        required: true
    }
});

const PokemonStat = mongoose.model("PokemonStat", pokemonStatSchema);
export default PokemonStat;