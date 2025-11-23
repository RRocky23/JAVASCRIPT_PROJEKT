import mongoose, { Schema } from "mongoose";

const pokemonSchema = new Schema ({
    pokedexNumber: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    typeOne: {
        type: String,
        required: true
    },
    typeTwo: {
        type: String,
        required: false
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    habitat: {
        type: String,
        required: true
    },
    shape: {
        type: String,
        required: true
    },
    isLegendary: {
        type: Boolean,
        required: true
    },
    isMythical: {
        type: Boolean,
        required: true
    },
    evolutionChainId: {
        type: Number,
        required: true
    },
    evolutionStage: {
        type: Number,
        required: true
    },
    evolvesFrom: {
        type: String,
        required: false
    },
    evolutionMinLevel: {
        type: Number,
        required: true
    },
    spriteURL: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    generation: {
        type: Number,
        required: true
    } 
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;