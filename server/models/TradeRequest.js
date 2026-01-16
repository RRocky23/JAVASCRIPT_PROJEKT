import mongoose, { Schema } from "mongoose";

const tradeRequestSchema = new Schema({
    fromUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromPokemon: {
        type: Schema.Types.ObjectId,
        ref: 'UserPokemon',
        required: true
    },
    toPokemon: {
        type: Schema.Types.ObjectId,
        ref: 'UserPokemon',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TradeRequest = mongoose.model("TradeRequest", tradeRequestSchema);
export default TradeRequest;
