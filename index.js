var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SerialPort = require('serialport');

app.use(express.static('public'));
app.use('/', express.static('public'));

http.listen(3000, function(){
    console.log('App listening on port 3000');
  });

io.on('connection', function(socket){
    console.log("New Connection");

    socket.on('disconnect', function(){
        console.log('Connection closed');
    });

    socket.on('text', function(str){
        console.log("Received " + str);
        socket.emit('text', str);
    })
});

setInterval( function(){
    SerialPort.list(function (errors, ports){
        console.log("Begin Ports\n");
        var arr = [];
        ports.forEach(element => {
            arr.push(element.comName);
            // io.emit('text', element.comName);
            // console.log(element.comName);
        });
        io.emit('ports', arr);
        console.log(arr);
    });
}, 5000);
