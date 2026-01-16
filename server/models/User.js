import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    refreshToken: {
        type: String,
        required: false,
        default: null
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
    currency: {
        type: Number,
        required: true,
        default: 100
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
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);
export default User;