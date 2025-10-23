import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Catch them all!");
});

app.get("/pokemons", (req, res) => {
    res.send("No pokemons here yet.");
});

app.listen(8000, () => {
    console.log("Kieszonkowe potwory are running on http://localhost:8000");
});