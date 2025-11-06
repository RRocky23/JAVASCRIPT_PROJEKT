import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    experiencePoints: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    currentLocationLat: {
        type: Number,
        required: true
    },
    currentLocationLng: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
});

const User = mongoose.model("User", userSchema);
export default User;