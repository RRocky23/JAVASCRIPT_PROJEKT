import mongoose from "mongoose";
import "dotenv/config";

import pokemonDataSeeder from "./pokemonDataSeeder.js"

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('Successfully conected to Pocket Monsters DB');

        await pokemonDataSeeder();
    }
    catch(err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
};