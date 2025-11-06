import express from "express";
import cors from "cors";
import "dotenv/config";

import account from "./routes/account.js"
import profile from "./routes/profile.js";
import { swaggerDocs } from "./docs/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/account", account)
app.use("/profile", profile)

app.get("/", (req, res) => {
    res.send("Catch them all!");
});

app.get("/pokemons", (req, res) => {
    res.send("No pokemons here yet.");
});

swaggerDocs(app, process.env.PORT);

app.listen(process.env.PORT, () => {
    console.log('Pocket Monsters server is running on http://localhost:' + process.env.PORT);
    console.log('Swagger docs avaiable at http://localhost:' + process.env.PORT + '/api-docs');
});