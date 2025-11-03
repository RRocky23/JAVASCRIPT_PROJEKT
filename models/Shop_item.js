import mongoose, { Schema } from "mongoose";

const shop_itemSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
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

const Shop_item = mongoose.model("Shop_item", shop_itemSchema);
export default Shop_item;