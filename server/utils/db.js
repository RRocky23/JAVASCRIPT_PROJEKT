import mongoose from "mongoose";
import "dotenv/config";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('Successfully conected to Pocket Monsters DB');
    }
    catch(err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
};