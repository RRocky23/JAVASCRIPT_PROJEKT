import mongoose, { Schema } from "mongoose";

const shopItemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priceExperience: {
        type: Number,
        required: true
    },
    priceCoins: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    stockLimit: {
        type: Number,
        required: true
    }
});

const ShopItem = mongoose.model("ShopItem", shopItemSchema);
export default ShopItem;