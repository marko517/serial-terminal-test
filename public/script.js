var socket = io();
socket.emit('text', "Hello");
socket.on('text', function(str){
    console.log("Received Message: " + str);
    $('paragraph').text(str);
});