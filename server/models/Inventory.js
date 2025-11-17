import mongoose, { Schema } from "mongoose";

const inventorySchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
