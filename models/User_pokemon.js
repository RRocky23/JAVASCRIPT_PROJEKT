import mongoose, { Schema } from "mongoose";

const user_pokemonSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
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

const User_pokemon = mongoose.model("User_pokemon", user_pokemonSchema);
export default User_pokemon;