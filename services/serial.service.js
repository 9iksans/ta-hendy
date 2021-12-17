import SerialPort from "serialport";
import Readline from "@serialport/parser-readline";
import { io } from "../index.js"
import * as math from "mathjs";


const point = [[1, 1], [5, 1], [5, 5], [1,5]]
const distance =[1, 3, 5, 4.123105625617661]

export const convertToCoordinate = (distance) => {
    var matrixA = math.matrix([
        [
            (2 * (point[0][0] - point[1][0])),
            (2 * (point[0][0] - point[2][0])),
            (2 * (point[0][0] - point[3][0]))
        ],
        [
            (2 * (point[0][1] - point[1][1])),
            (2 * (point[0][1] - point[2][1])),
            (2 * (point[0][1] - point[3][1]))
        ]
    
    ])
    
    var matrixB = math.matrix([
        [
            Math.pow(point[0][0],2) - Math.pow(point[1][0],2) + Math.pow(point[0][1],2) - Math.pow(point[1][1],2) + Math.pow(distance[1],2) - Math.pow(distance[0],2),
            Math.pow(point[0][0],2) - Math.pow(point[2][0],2) + Math.pow(point[0][1],2) - Math.pow(point[2][1],2) + Math.pow(distance[2],2) - Math.pow(distance[0],2),
            Math.pow(point[0][0],2) - Math.pow(point[3][0],2) + Math.pow(point[0][1],2) - Math.pow(point[3][1],2) + Math.pow(distance[3],2) - Math.pow(distance[0],2)
            
        ]
    ])
    
    var matrixATranspose = math.transpose(matrixA)
    
    var first = math.multiply(matrixA,matrixATranspose)
    var inverted = math.inv(first)
    var second = math.multiply(matrixATranspose,inverted)
    var result = math.multiply(matrixB, second )
    return result._data
    // console.log(result)
}

export const check = () =>{
    io.on('connection', (socket) => {
        console.log('new Connection established');
        socket.broadcast.emit("coordinate", convertToCoordinate(distance))
    });
}


// console.log("X : " + result._data[0][0]*5 + ", Y: " + result._data[0][1]*5)

// const port = new SerialPort('/dev/cu.usbmodem144301', { baudRate: 9600 });
// const parser = port.pipe(new Readline({ delimiter: '\n' }));

// port.on("open", () => {
//     console.log('serial port open');
// });

// parser.on('data', data => {
//     data = JSON.parse(data)
//     console.log(data)
// });