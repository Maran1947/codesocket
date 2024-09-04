import express from "express";
import cors from 'cors'
import { initSocketServer } from "./socket/socket_server.js";
import { initApiRoutes } from "./api/api.js";
import connectDB from "./db/dbconn.js";
const app = express();

app.use(cors({
    origin: '*'
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

connectDB()
initApiRoutes(app);
initSocketServer(app);
