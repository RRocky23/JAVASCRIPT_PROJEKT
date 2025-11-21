import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import "dotenv/config";

import { fileURLToPath } from "url";
import { authRequired, apiOnly, adminOnly } from "./middlewares/auth.js";
import { connectToDatabase } from "./utils/db.js";
import { swaggerDocs } from "./docs/swagger.js";

import rootRoutes from "./routes/root.js";
import accountRoutes from "./routes/account.js";
import profileRoutes from "./routes/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log('CLIENT_URL:', process.env.CLIENT_URL);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:8080',
  'http://localhost:' + process.env.PORT,
  'http://127.0.0.1:' + process.env.PORT,
  'https://tgfwrvxf-8001.euw.devtunnels.ms'
];

const corsOptions = {
  origin: (origin, callback) => {
    if(!origin) {
        return callback(null, true);
    }
    
    if(allowedOrigins.includes(origin)) {
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