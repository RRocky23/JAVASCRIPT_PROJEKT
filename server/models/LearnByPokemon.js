import mongoose, { Schema } from "mongoose";

const learnByPokemonSchema = new Schema({
    pokedexNumber: {
        type: Number,
        required: true
    },
    moveName: {
        type: String,
        required: true
    }
});

const LearnByPokemon = mongoose.model('LearnByPokemon', learnByPokemonSchema);
export default LearnByPokemon;