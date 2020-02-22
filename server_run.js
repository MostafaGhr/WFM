var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var PORT = 6024;

let sender = require('./SyncServer/send_sync_signal.js')

let raspberry_ip_list = [];

sender.send_start(raspberry_ip_list, 15000);

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true);
});

client.on('message', function (message, rinfo) {
    if(raspberry_ip_list.find((element) => { return element == rinfo.address; }) == undefined){
        raspberry_ip_list.push(rinfo.address);
    }
    
    console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message);
});

client.bind(PORT);

