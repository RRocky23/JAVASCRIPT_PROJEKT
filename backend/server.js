import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config";

import { connectToDatabase } from "./utils/db.js";
import { swaggerDocs } from "./docs/swagger.js";

import account from "./routes/account.js"
import profile from "./routes/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/home', (req, res) => {
    res.send('This is home page');
});

app.use('/api/account', account);
app.use('/api/profile', profile);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

swaggerDocs(app, process.env.PORT);

app.listen(process.env.PORT, async () => {
    await connectToDatabase();
    console.log('Pocket Monsters server is running on http://localhost:' + process.env.PORT);
    console.log('Swagger docs avaiable at http://localhost:' + process.env.PORT + '/api-docs');
});