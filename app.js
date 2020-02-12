const ping = require('net-ping');
const ping_dest = '8.8.8.8';
const trace_count = 4;
const { Parser } = require('json2csv');
const fs = require("fs");
const { exec } = require('child_process');
const express = require('express');
const app = express();

let ping_res = {};
let trace_res = [];
const save_dir = "/home/mostafa/WFM/results";

exec('mkdir ' + save_dir);

var p = ping.createSession({
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 52,
    retries: 1,
    sessionId: (process.pid % 65535),
    timeout: 2000,
    ttl: 128
});
let pinger = (ip) => {
    return new Promise((resolve, reject) => {
        p.pingHost(ip, (error, target, sent, rcvd) => {
            if(!error){
                resolve(rcvd - sent);
            } else {
                reject(new Error(error))
            }
        })
    })   
}
function doneCb3 (error, target) {
    if (error)
        console.log (target + ": " + error.toString ());
    else
        console.log (target + ": Done");  

        trace_res.forEach(trace_ip => {
        setInterval(() => {
            pinger(trace_ip)
            .then(ms => {
                if (ping_res[trace_ip] == undefined){
                    ping_res[trace_ip] = []
                }
                var time = "";
                let date_ob = new Date(Date.now());
                time = date_ob.toLocaleString('en-US-u-ca-persian', {
                    timeZone: 'Asia/Tehran',
                    hourCycle: 'h24'
                });
                ping_res[trace_ip].push({
                    "dest":trace_ip,
                    "date":time,
                    "rtt":ms
                })
                // console.log(ping_res);
                
                
            })
            .catch(e => {
                console.log(e)
            })
        }, 1000)
    });
}
function feedCb (error, target, ttl, sent, rcvd) {
    var ms = rcvd - sent;
    if (error) {
        if (error instanceof ping.TimeExceededError) {
            // console.log (target + ": " + error.source + " (ttl="
            //         + ttl + " ms=" + ms +")");
            trace_res.push(error.source);
        } else {
        }
    } else {
    }
}
function main() {
    p.traceRoute (ping_dest, trace_count, feedCb, doneCb3);    
}
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    if (d.toString().trim() == "save"){
        for(var k in ping_res) {
            const json2csvParser = new Parser();
            csver = json2csvParser.parse(ping_res[k]);
            fs.writeFileSync(save_dir + k.toString() + ".csv", csver);
        }
        console.log("done!");
    }
  });
function iperf_handler(iperf_ip, text_file) {
    exec('iperf3 -c ' + iperf_ip + " -J > " + save_dir + text_file + ".txt");
}

app.get('/list', function(req, res){    
    fs.readdir(save_dir, function(err, items) {   
        html_ret = "";   
        for (var i=0; i<items.length; i++) {
            if(items[i].substr(items[i].length - 4) == ".txt" || items[i].substr(items[i].length - 4) == ".csv"){
                html_ret += "<a href=/download/?dl=" + items[i]+ ">" + items[i] + "</a><br>";
            }
        }
        res.send(html_ret);
    });    
});

app.get('/download', function(req, res){    
    let url = req.query.dl;
    res.download(save_dir + "/" + url); // Set disposition and send it.
});
app.get('/start', function(req, res){
    
});
app.listen(3000, () => console.log(`App listening on port 3000!`))


// main();