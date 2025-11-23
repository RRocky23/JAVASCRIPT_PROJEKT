import mongoose, { Schema } from "mongoose";

const battleSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    wildPokemonId: {
        type: Number,
        required: true
    },
    userPokemonId: {
        type: Number,
        required: true
    },
    battleType: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    userPokemonHpRemaining: {
        type: Number,
        required: true
    },
    wildPokemonHpRemaining: {
        type: Number,
        required: true
    },
    experienceGained: {
        type: Number,
        required: true
    },
    battleDuration: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

const Battle = mongoose.model("Battle", battleSchema);
export default Battle;
