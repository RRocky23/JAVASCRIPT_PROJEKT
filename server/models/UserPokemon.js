import mongoose, { Schema } from "mongoose";

const userPokemonSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    pokemonId: {
        type: Number,
        required: true
    },
    customName: {
        type: String,
        required: false
    },
    level: {
        type: Number,
        required: true
    },
    experiencePoints: {
        type: Number,
        required: true
    },
    currentHp: {
        type: Number,
        required: true
    },
    maxHp: {
        type: Number,
        required: true
    },
    maxPp: {
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
    moveOne: {
        type: String,
        required: true
    },
    moveTwo: {
        type: String,
        required: true
    },
    moveThree: {
        type: String,
        required: false
    },
    moveFour: {
        type: String,
        required: false
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