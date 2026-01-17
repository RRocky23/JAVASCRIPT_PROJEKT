import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import "dotenv/config";

import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { initSockets } from "./middlewares/socket.js"
import { startWeatherLoop } from "./utils/weather.js"
import { startSpawnLoop } from "./utils/spawnManager.js"
import { authRequired, apiOnly, adminOnly } from "./middlewares/auth.js";
import { connectToDatabase } from "./utils/db.js";
import { swaggerDocs } from "./docs/swagger.js";

import rootRoutes from "./routes/root.js";
import accountRoutes from "./routes/account.js";
import profileRoutes from "./routes/profile.js";
import pokedexRoutes from "./routes/pokedex.js";
import exchangeRoutes from "./routes/exchange.js";
import shopRoutes from "./routes/shop.js";
import inventoryRoutes from "./routes/inventory.js";
import friendsRoutes from "./routes/friends.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log('CLIENT_URL:', process.env.CLIENT_URL);

const allowedOrigins = new Set([
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:8080',
  process.env.CLIENT_URL,
  process.env.HOST_URL,
].filter(Boolean));

const corsOptions = {
  origin: (origin, callback) => {
    if(!origin) {
      return callback(null, true);
    }
    
    if(allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiOnly);
app.use('/api-docs', adminOnly);

app.use('/api', rootRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/profile', authRequired, profileRoutes);
app.use('/api/pokedex', authRequired, pokedexRoutes);
app.use('/api/exchange', authRequired, exchangeRoutes);
app.use('/api/shop', authRequired, shopRoutes);
app.use('/api/inventory', authRequired, inventoryRoutes);
app.use('/api/friends', authRequired, friendsRoutes);

swaggerDocs(app, process.env.PORT);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const server = http.createServer(app);
const io = new Server(server, {
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

initSockets(io);

await connectToDatabase();
await startWeatherLoop();

startSpawnLoop();

server.listen(process.env.PORT, '0.0.0.0', async () => {
  console.log('Pocket Monsters server is running on http://localhost:' + process.env.PORT);
  console.log('Swagger docs avaiable at http://localhost:' + process.env.PORT + '/api-docs');
});