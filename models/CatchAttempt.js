import mongoose, { Schema } from "mongoose";

const catchAttemptSchema = new Schema({
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

const CatchAttempt = mongoose.model("CatchAttempt", catchAttemptSchema);
export default CatchAttempt;