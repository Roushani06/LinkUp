import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';

const app = express();
const server = http.createServer(app); // using this because socket.io needs http server

// middlewares
app.use(express.json({limit: '4mb'})); // to parse json data from request body and can add image of max 4mb size
app.use(cors()); // it will allow all the URL to access our backend server

app.use("/api/status", (req, res)=>res.send("server is live"));

//connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
