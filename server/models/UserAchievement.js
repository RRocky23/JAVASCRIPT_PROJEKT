import mongoose, { Schema } from "mongoose";

const userAchievementSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    achievementType: {
        type: String,
        required: true
    },
    achievementName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    progressCurrent: {
        type: Number,
        required: true
    },
    progressTarget: {
        type: Number,
        required: true
    },
    unlocked: {
        type: Boolean,
        required: true
    },
    unlockedAt: {
        type: Date,
        required: true
    }
});

const UserAchievement = mongoose.model("UserAchievement", userAchievementSchema);
export default UserAchievement;