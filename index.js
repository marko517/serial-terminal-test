const express = require("express")
const ws = require("nodejs-websocket")
var SerialPort = require('serialport');
const app = express();

app.use(express.static('public'));
app.use('/', express.static('public'));

app.listen(3000, ()=> console.log("Example app listening on port 3000"));

var server = ws.createServer(function (conn){
    console.log("New Connection");
    conn.on("text", function(str){
        console.log("Received "+str)
        //conn.sendText(serialPortsList);
    })
    conn.on("close", function (code, reason){
        console.log("Connection closed");
    })
}).listen(3001);

setInterval( function(){
    SerialPort.list(function (errors, ports){
        server.connections.forEach(element => {
            element.sendText(ports);
        });
    });
}, 5000);