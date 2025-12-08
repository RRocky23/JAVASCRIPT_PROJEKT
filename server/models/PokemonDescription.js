import mongoose, { Schema } from "mongoose";

const pokemonDescriptionSchema = new Schema ({
    pokedexNumber: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const PokemonDescription = mongoose.model('PokemonDescription', pokemonDescriptionSchema);
export default PokemonDescription;