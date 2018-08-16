var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline')

app.use(express.static('public'));
app.use('/', express.static('public'));
app.use('/lib', express.static('public/bower_components'));

var SerialConnection = null;
var connectedSocket = null;


http.listen(3000, function () {
    console.log('App listening on port 3000');
});

io.on('connection', function (socket) {
    console.log("New Connection");
    sendPorts(socket);

    socket.on('disconnect', function () {
        console.log('Connection closed');
    });

    socket.on('getPorts', function () {
        console.log("Sending Ports");
        sendPorts(socket);
    });

    socket.on('text', function (str) {
        console.log("Received " + str);
        socket.emit('text', str);
    });

    socket.on('comConnect', function (comObj) {
        console.log(comObj);
        if(comObj!= undefined){
            comConnect(comObj, socket);

        }
    });

    socket.on('comDisconnect', function () {
        console.log("COM Disconnect");
        SerialConnection.close();
        SerialConnection = null;
    })

    socket.on('comSend', function (str) {
        console.log("Sending " + str);
        SerialConnection.write(str);
    })
});

function comConnect(comObj, socket) {
    if(comObj == undefined){
        consle.log("Non existant port");
    }
    else{
    console.log("COM Connect " + comObj.comName);
    if (SerialConnection == null) {
        SerialConnection = new SerialPort(comObj.comName, comObj);
        parser = SerialConnection.pipe(new Readline({ delimiter: '\r\n' }))
        parser.on('data', SerialDataCallback);
        connectedSocket = socket;
        socket.emit('comConnectAccept');
        console.log("Serial Connection Established On: " + comObj.comName);
    }
    else {
        console.log("Serial Connection Already Established On Other Port");
        socket.emit('comConnectRefuse');
    }
    }
}

function sendPorts(socket) {
    SerialPort.list(function (errors, ports) {
        if (socket == null) {
            io.emit('ports', ports);
        }
        else {
            socket.emit('ports', ports);
        }
    });
}

function SerialDataCallback(str) {
    connectedSocket.emit('comReceive', str);
}
