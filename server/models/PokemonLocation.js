import mongoose, { Schema } from "mongoose";

const pokemonLocationSchema = new Schema({
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

const PokemonLocation = mongoose.model("PokemonLocation", pokemonLocationSchema);
export default PokemonLocation;