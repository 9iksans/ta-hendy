import * as serialInput from "./services/serial.service.js";
import express from "express";
import http from 'http';
import { Server } from "socket.io";


const app = express();
const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
    cors: { origin: '*' }
});

serialInput.serialParse()

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended : true, limit: '50mb'}))
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render('./index')
})

httpServer.listen(3000, () => {
    console.log('App server connect on port 3000');
})

