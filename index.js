const express = require('express')
var ws = require("nodejs-websocket")
const app = express()

app.use(express.static('public'))
app.use('/', express.static('public'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

 
var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
        conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)