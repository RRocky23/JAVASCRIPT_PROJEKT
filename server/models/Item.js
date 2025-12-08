import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true,
        enum: ['pokeball', 'potion', 'revive']
    },
    effect: {
        type: String,
        required: true
    },
    strength: {
        type: Number,
        required: true
    },
    sprite: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Item = mongoose.model('Item', itemSchema);
export default Item;