var socket = io();
socket.emit('text', "Hello");
socket.on('text', function(str){
    console.log("Received Message: " + str);
    $('paragraph').text(str);
});

socket.on('ports', function(arr){
    var $el = $("#portsList");
    $el.empty(); // remove old options
    arr.forEach(element => {
        $el.append($("<option></option>")
        .attr("value", element).text(element));
    });
})