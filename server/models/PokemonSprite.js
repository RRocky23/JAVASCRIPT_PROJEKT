import mongoose, { Schema } from "mongoose";

const pokemonSpriteSchema = new Schema ({
    pokedexNumber: {
        type: Number,
        required: true
    },
    frontSprite: {
        type: String,
        required: true
    },
    shinySprite: {
        type: String,
        required: true
    },
    pokedexFrontSprite: {
        type: String,
        required: true
    },
    pokedexBackSprite: {
        type: String,
        required: true
    },
    pokedexAnimatedSprite: {
        type: String,
        required: true
    },
    evolutionSprite: {
        type: String,
        required: true
    }
});

const PokemonSprite = mongoose.model('PokemonSprite', pokemonSpriteSchema);
export default PokemonSprite;
