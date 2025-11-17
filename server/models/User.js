import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
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
    role: {
        type: String,
        required: true,
        default: 'User'
    },
    experiencePoints: {
        type: Number,
        required: true,
        default: 0
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    currentLocationLat: {
        type: Number,
        required: true,
        default: 0.0
    },
    currentLocationLng: {
        type: Number,
        required: true,
        default: 0.0
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const User = mongoose.model("User", userSchema);
export default User;