import mongoose, { Schema } from "mongoose";

const pokemon_locationSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    pokemonId: {
        type: Number,
        required: true
    },
    locationName: {
        type: String,
        required: true
    },
    locationLat: {
        type: Number,
        required: true
    },
    locationLng: {
        type: Number,
        required: true
    },
    spawnChance: {
        type: Number,
        required: true
    },
    minLevel: {
        type: Number,
        required: true
    },
    maxLevel: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});

const Pokemon_location = mongoose.model("Pokemon_location", pokemon_locationSchema);
export default Pokemon_location;