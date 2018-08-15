var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SerialPort = require('serialport');

app.use(express.static('public'));
app.use('/', express.static('public'));
app.use('/lib', express.static('public/bower_components'));

http.listen(3000, function(){
    console.log('App listening on port 3000');
  });

io.on('connection', function(socket){
    console.log("New Connection");
    sendPorts(socket);

    socket.on('disconnect', function(){
        console.log('Connection closed');
    });

    socket.on('getPorts', function(){
        console.log("Sending Ports");
        sendPorts(socket);
    });

    socket.on('text', function(str){
        console.log("Received " + str);
        socket.emit('text', str);
    })
});

function sendPorts(socket){
    SerialPort.list(function (errors, ports){
        console.log("Begin Ports\n");
        if(socket == null)
        {
            io.emit('ports', ports);
        }
        else
        {
            socket.emit('ports', ports);
        }
        console.log(ports);
    });
}
