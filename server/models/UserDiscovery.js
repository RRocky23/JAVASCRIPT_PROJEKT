import mongoose, { Schema } from "mongoose";

const userDiscoverySchema = new Schema ({
    userId: {
        type: String,
        required: true
    },
    pokemonId: {
        type: Number,
        required: true
    },
    firstTimeCaught: {
        type: Date,
        required: true
    }
});

const UserDiscovery = mongoose.model("UserDiscovery", userDiscoverySchema);
export default UserDiscovery;