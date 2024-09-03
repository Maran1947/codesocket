import express from "express";
import { initSocketServer } from "./socket/socket_server.js";
import { initApiRoutes } from "./api/api.js";
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

initApiRoutes(app);
initSocketServer(app);
