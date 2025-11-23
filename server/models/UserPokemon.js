import mongoose, { Schema } from "mongoose";

const userPokemonSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    pokemonId: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    currentHp: {
        type: Number,
        required: true
    },
    experiencePoints: {
        type: Number,
        required: true
    },
    isFavourite: {
        type: Boolean,
        required: true
    },
    caughtDate: {
        type: Date,
        required: true
    },
    caughtLocationLat: {
        type: Number,
        required: true
    },
    caughtLocationLng: {
        type: Number,
        required: true
    },
    caughtBallType: {
        type: String,
        required: true
    }
});

const UserPokemon = mongoose.model("UserPokemon", userPokemonSchema);
export default UserPokemon;