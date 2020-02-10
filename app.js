const ping = require('net-ping');
const ping_dest = '8.8.8.8';
const trace_count = 4;
const { Parser } = require('json2csv');
const fs = require("fs");

let ping_res = {};
let trace_res = [];

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
function doneCb (error, target) {
    if (error)
        console.log (target + ": " + error.toString ());
    else
        console.log (target + ": Done");  

        trace_res.forEach(trace_ip => {
        setInterval(() => {
            pinger(trace_ip)
            .then(ms => {
                if (ping_res[trace_ip] == undefined){
                    ping_res[trace_ip] = {}
                }
                var time = "";
                let date_ob = new Date(Date.now());
                time = date_ob.toLocaleString('en-US-u-ca-persian', {
                    timeZone: 'Asia/Tehran',
                    hourCycle: 'h24'
                });
                ping_res[trace_ip][time] = ms;
                console.log(ping_res);
                
            })
            .catch(e => {
                console.log(e)
            })
        }, 1000)
    });
}
function doneCb1 (error, target) {
    if (error)
        console.log (target + ": " + error.toString ());
    else
        console.log (target + ": Done");  

        trace_res.forEach(trace_ip => {
        setInterval(() => {
            pinger(trace_ip)
            .then(ms => {
                console.log(trace_ip + "_" + ms);
                
                if (ping_res[trace_ip] == undefined){
                    ping_res[trace_ip] = {}
                }
                var time = "";
                let date_ob = new Date(Date.now());
                time = date_ob.toLocaleString('en-US-u-ca-persian', {
                    timeZone: 'Asia/Tehran',
                    hourCycle: 'h24'
                });;

                if (ping_res[trace_ip]["date"] == undefined){
                    ping_res[trace_ip]["date"] = []
                }
                if (ping_res[trace_ip]["ms"] == undefined){
                    ping_res[trace_ip]["ms"] = []
                }

                
                ping_res[trace_ip]["date"].push(time) ;
                ping_res[trace_ip]["ms"].push( ms) ;
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


    p.traceRoute (ping_dest, trace_count, feedCb, doneCb1);    



}

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    if (d.toString().trim() == "save"){
        console.log(ping_res);
        const json2csvParser = new Parser({ fields: ['date', 'ms'],   flatten: true});
        for(var k in ping_res) {
            // console.log(k, ping_res[k]);
            csver = json2csvParser.parse(ping_res[k]);
            
            fs.writeFileSync("./ping-res/" + k.toString() + ".csv", csver)
        }
        console.log("done!");
    }
  });

main();