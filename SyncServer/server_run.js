var dgram = require('dgram');
var client = dgram.createSocket('udp4');
const settings = require('./../config.js')
var PORT = 6024;

const express = require('express');
const app = express();

let sender = require('./send_sync_signal.js')

let raspberry_ip_list = [];

app.get('/hello',(req, res) => {
    if(raspberry_ip_list.find((element) => { return element == req.ip; }) == undefined){
        raspberry_ip_list.push(req.ip);
        console.log(req.ip + " was added to ip list");
        
    }
    
    console.log('Message from: ' + req.ip + ':' + req.port);

});

setInterval(() => {
    sender.send_start(raspberry_ip_list);
    
}, settings.iperf_interval * 1000);

client.on('listening', () => {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true);
});

client.on('message', (message, rinfo) => {
    if(raspberry_ip_list.find((element) => { return element == rinfo.address; }) == undefined){
        raspberry_ip_list.push(rinfo.address);
        console.log(rinfo.address + " was added to ip list");
        
    }
    
    console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message);
});

client.bind(PORT);

app.listen(settings.sync_port, () => console.log('App listening on port 3000!'));
