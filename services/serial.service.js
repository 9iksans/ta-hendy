import SerialPort from "serialport";
import Readline from "@serialport/parser-readline";
import { io } from "../index.js"
import * as math from "mathjs";
import KalmanFilter from "kalman-filter";


const point = [[0, 0], [5, 0], [5, 5], [0, 5]]
var distance = [0, 0, 0, 0], kalmanDbmObservation = [[],[],[],[]], kalmanDistanceObservation = [[],[],[],[]]

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
            Math.pow(point[0][0], 2) - Math.pow(point[1][0], 2) + Math.pow(point[0][1], 2) - Math.pow(point[1][1], 2) + Math.pow(distance[1], 2) - Math.pow(distance[0], 2),
            Math.pow(point[0][0], 2) - Math.pow(point[2][0], 2) + Math.pow(point[0][1], 2) - Math.pow(point[2][1], 2) + Math.pow(distance[2], 2) - Math.pow(distance[0], 2),
            Math.pow(point[0][0], 2) - Math.pow(point[3][0], 2) + Math.pow(point[0][1], 2) - Math.pow(point[3][1], 2) + Math.pow(distance[3], 2) - Math.pow(distance[0], 2)

        ]
    ])

    var matrixATranspose = math.transpose(matrixA)

    var first = math.multiply(matrixA, matrixATranspose)
    var inverted = math.inv(first)
    var second = math.multiply(matrixATranspose, inverted)
    var result = math.multiply(matrixB, second)
    console.log(result._data)
    return result._data
    // console.log(result)
}

export const check = () => {
    io.on('connection', (socket) => {
        console.log('new Connection established');
        socket.broadcast.emit("coordinate", convertToCoordinate(distance))
    });
}

const dbmToDistance = (dbm, deviceID) => {
    var distance = Math.pow(10, (-40.79 + dbm) / 11.542)
    console.log("distance sebelum kalman ["+ deviceID +"] : " + distance.toString())
    if(kalmanDistanceObservation[deviceID].length == 5){
        kalmanDistanceObservation[deviceID].shift()
        kalmanDistanceObservation[deviceID].push(distance)
        distance = dbmKalman(kalmanDistanceObservation[deviceID])
        
        return distance
    }else{
        kalmanDistanceObservation[deviceID].push(distance)
        console.log("Initializing")
    }
   
}

const dbmKalman = (dbm)=>{
    //console.log"dbm)
    const kFilter = new KalmanFilter.KalmanFilter();
    const res = kFilter.filterAll(dbm)
    //console.log("db sesudah kalman : "+ res[res.length-1][0].toString())
    return res[res.length-1][0]
}

const sampling = (data)=>{
    try {
        data = data.substring(0, data.length-3) + "]"
        data = JSON.parse(data)
        if(kalmanDbmObservation[0].length == 5){
            kalmanDbmObservation[0].shift()
            kalmanDbmObservation[0].push(data[0].distance)
            console.log(dbmKalman(kalmanDbmObservation[0]))
        }else{
            kalmanDbmObservation[0].push(data[0].distance)
            console.log("Initializing..")
        }
        
        
    } catch (error) {
        console.log("Data not Fit" + error)
    }
}

const execution = (data)=>{
    try {
        data = data.substring(0, data.length-3) + "]"
        data = JSON.parse(data)
	console.log(data)
        if (data.length == 4) {
            for (let index = 0; index < data.length; index++) {
                if (data[index].device === '41 9B 6B 59 ') {
                    if(kalmanDbmObservation[0].length == 5){
                        kalmanDbmObservation[0].shift()
                        kalmanDbmObservation[0].push(data[index].distance)
                        console.log("DB sesudah Kalman [0] : " +dbmKalman(kalmanDbmObservation[0] ))
                        distance[0] = dbmToDistance(dbmKalman(kalmanDbmObservation[0]), 0)
                    }else{
                        kalmanDbmObservation[0].push(data[index].distance)
                        console.log("Initializing..")
                    }
                    
                } else if (data[index].device === '41 9B 6B 6D ') {
                    if(kalmanDbmObservation[1].length == 5){
                        kalmanDbmObservation[1].shift()
                        kalmanDbmObservation[1].push(data[index].distance)
                        console.log("DB sesudah Kalman [1] : " +dbmKalman(kalmanDbmObservation[1] ))
                        distance[1] = dbmToDistance(dbmKalman(kalmanDbmObservation[1]), 1)
                    }else{
                        kalmanDbmObservation[1].push(data[index].distance)
                        console.log("Initializing..")
                    }
                } else if (data[index].device === '41 C3 77 7A ') {
                    if(kalmanDbmObservation[2].length == 5){
                        kalmanDbmObservation[2].shift()
                        kalmanDbmObservation[2].push(data[index].distance)
                        console.log("DB sesudah Kalman [2] : " +dbmKalman(kalmanDbmObservation[2] ))
                        distance[2] = dbmToDistance(dbmKalman(kalmanDbmObservation[2]), 2)
                    }else{
                        kalmanDbmObservation[2].push(data[index].distance)
                        console.log("Initializing..")
                    }
                } else if (data[index].device === '41 9B 6C F0 ') {
                    if(kalmanDbmObservation[3].length == 5){
                        kalmanDbmObservation[3].shift()
                        kalmanDbmObservation[3].push(data[index].distance)
                        console.log("DB sesudah Kalman [3] : " +dbmKalman(kalmanDbmObservation[3] ))
                        distance[3] = dbmToDistance(dbmKalman(kalmanDbmObservation[3]), 3)
                    }else{
                        kalmanDbmObservation[3].push(data[index].distance)
                        console.log("Initializing..")
                    }
                }
            }
            console.log(distance)
            io.sockets.emit('coordinate', convertToCoordinate(distance))
            io.sockets.emit('distance', distance)
        }
    } catch (error) {
        console.log("Data not Fit" + error)
    }
}


export const serialParse = () => {
    const port = new SerialPort('/dev/ttyS0', { baudRate: 9600 });
    const parser = port.pipe(new Readline({ delimiter: '\n' }));

    port.on("open", () => {
        console.log('serial port open');
    });

    parser.on('data', data => {
        //sampling(data)
        execution(data);

    });
}