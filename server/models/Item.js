import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
    itemId: {
        type: String,
        required: true,
        unique: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true,
        enum: ['pokeball', 'potion', 'revive', 'evolution_stone']
    },
    description: {
        type: String,
        required: true
    },
    effect: {
        type: String,
        required: false
    },
    strength: {
        type: Number,
        required: false
    },
    sprite: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    maxQuantity: {
        type: Number,
        required: true,
        default: 99
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);
export default Item;