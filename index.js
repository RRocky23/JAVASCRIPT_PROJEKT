import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User.js";

const ConnectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("Successfully connected to PocketMonstersDB");
    } 
    catch(err) {
        console.error("MongoDB connection error:", err);
    }
};

const TestUser = async() => {
    const userDuplicate = await User.findOne({id: 0}).exec();
    
    if(userDuplicate) {
        console.log("User is already in db");
        return;
    }

    const newUser = await User.create({
        id: 0,
        name: "Jan",
        surname: "Kowalski",
        username: "JKowal",
        email: "jan@kowalski.com",
        passwordHash: "12345678",
        birthDate: Date.now(),
        experiencePoints: 0,
        level: 1,
        currentLocationLat: 0,
        currentLocationLng: 0,
        createdAt: Date.now(),
        updatedAt: Date.now() 
    });
};

const StartServer = async() => {
    await ConnectToDB();
    await TestUser();
};

const app = express();

app.get("/", (req, res) => {
    res.send("Catch them all!");
});

app.get("/pokemons", (req, res) => {
    res.send("No pokemons here yet.");
});

app.listen(process.env.PORT, () => {
    console.log('Kieszonkowe potwory are running on http://localhost:' + process.env.PORT);
});

//Test db
StartServer();