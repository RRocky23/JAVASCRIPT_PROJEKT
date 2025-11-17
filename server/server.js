import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config";

import { connectToDatabase } from "./utils/db.js";
import { swaggerDocs } from "./docs/swagger.js";

import root from "./routes/root.js";
import account from "./routes/account.js";
import profile from "./routes/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', root);
app.use('/api/account', account);
app.use('/api/profile', profile);

swaggerDocs(app, process.env.PORT);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT, async () => {
    await connectToDatabase();
    console.log('Pocket Monsters server is running on http://localhost:' + process.env.PORT);
    console.log('Swagger docs avaiable at http://localhost:' + process.env.PORT + '/api-docs');
});