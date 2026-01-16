import mongoose, { Schema } from "mongoose";

const inventorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Compound index to ensure one entry per user per item
inventorySchema.index({ userId: 1, itemId: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
