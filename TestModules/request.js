var dgram = require('dgram'); 
var server = dgram.createSocket("udp4"); 
const settings = require("./../config.js")

function send_broadcast(){
    server.bind(() => {
        server.setBroadcast(true);
        setInterval(broadcastNew, 10000);
    });
}

function broadcastNew() {
    var message = new Buffer.alloc("Hello Client!".length, "Hello Client!")
    server.send(message, 0, message.length, settings.PORT, settings.BROADCAST_ADDR, function() {
        console.log("Sent '" + message + "'");
    });
}

module.exports = {send_broadcast}