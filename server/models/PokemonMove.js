import mongoose, { Schema } from "mongoose";

const pokemonMoveSchema = new Schema({
    pokemonId: {
        type: Number,
        required: true
    },
    moveName: {
        type: String,
        required: true
    },
    moveType: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    pp: {
        type: Number,
        required: true
    },
    damageClass: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    learnMethod: {
        type: String,
        required: true
    },
    learnLevel: {
        type: Number,
        required: true
    }
});

const PokemonMove = mongoose.model("PokemonMove", pokemonMoveSchema);
export default PokemonMove;