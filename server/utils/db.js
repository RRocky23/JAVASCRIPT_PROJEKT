import mongoose from "mongoose";
import "dotenv/config";

import runPokemonDataSeeders from "./pokemonDataSeeder.js"

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('Successfully conected to Pocket Monsters DB');

        await runPokemonDataSeeders();
    }
    catch(err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
};