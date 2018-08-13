    var webSocket = $.simpleWebSocket({ url: 'ws://127.0.0.1:3001/' });
    
    // reconnected listening
    webSocket.listen(function(message) {
        // console.log(message.text);
        $("text").content = message
    });

    webSocket.send({ 'text': 'hello' }).done(function() {
        // message send
    }).fail(function(e) {
        // error sending
    });