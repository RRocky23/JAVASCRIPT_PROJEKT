import mongoose, { Schema } from "mongoose";

const catch_attemptSchema = new Schema({
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
    ballType: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    },
    attemptNumber: {
        type: Number,
        required: true
    },
    pokemonHpPercentage: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

const Catch_attempt = mongoose.model("Catch_attempt", catch_attemptSchema);
export default Catch_attempt;