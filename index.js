import * as serialInput from "./services/serial.service.js";
import path from 'path'
import express from "express";
import http from 'http';
import { Server } from "socket.io";


const app = express();
const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
    cors: { origin: '*' }
});

const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);


// serialInput.serialParse()

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended : true, limit: '50mb'}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));
app.use('/', express.static(path.join(__dirname,"./views/dist")));




app.get("/", (req, res) => {
    res.render('dist/index')
})

httpServer.listen(3000, () => {
    console.log('App server connect on port 3000');
})


