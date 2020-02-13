const ping = require('net-ping');
const { exec } = require('child_process');
const { Parser } = require('json2csv');
const fs = require("fs");

const save_dir = "/home/mostafa/WFM/results/";

let ping_res = {};
let trace_res = [];
let ping_timer;
let ping_intervals = 0.5;
let ping_clock_before = 5;
let iperf_clock = 1;
let ping_clock_after = 5;
let iperf_server = "";
let iperf_textfile = "";

let test_counter = 0;

var p = ping.createSession({
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
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
function feedCb (error, target, ttl, sent, rcvd) {
    var ms = rcvd - sent;
    if (error) {
        if (error instanceof ping.TimeExceededError) {
            trace_res.push(error.source);
        } else {
        }
    } else {
    }
}
function doneCb (error, target) {
    if (error){
        console.log (target + ": " + error.toString ());
    }

    ping_traces();
}
function doneCb3 (error, target) {
    if (error){
        console.log (target + ": " + error.toString ());
    }
    console.log("trace list updated!");
    
}
function doneCb2 (error, target) {
    if (error){
        console.log (target + ": " + error.toString ());
    }
    trace_res.forEach(trace_ip => {
        setTimeout(() =>{
            ping_timer = setInterval(() => {
                pinger(trace_ip)
                    .then(ms => {
                        if (ping_res[trace_ip] == undefined){
                            ping_res[trace_ip] = []
                        }
                        //shamsi
                        // var shamsi = "";
                        // let date_ob = new Date(Date.now());
                        // shamsi = date_ob.toLocaleString('en-US-u-ca-persian', {
                        //     timeZone: 'Asia/Tehran',
                        //     hourCycle: 'h24'
                        // });
                        //miladi
                        let date_ob = Date();
                        ping_res[trace_ip].push({
                            "dest":trace_ip,
                            "date":date_ob,
                            "rtt":ms
                        })        
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }, 1000 * ping_intervals)
        }, ping_clock_before * 1000);
    });
}
function ping_traces(){
    console.log(trace_res);
    trace_res.forEach(trace_ip => {
        ping_timer = setInterval(() => {
            pinger(trace_ip)
                .then(ms => {
                    if (ping_res[trace_ip] == undefined){
                        ping_res[trace_ip] = []
                    }
                    //shamsi
                    // var shamsi = "";
                    // let date_ob = new Date(Date.now());
                    // shamsi = date_ob.toLocaleString('en-US-u-ca-persian', {
                    //     timeZone: 'Asia/Tehran',
                    //     hourCycle: 'h24'
                    // });
                    //miladi
                    let date_ob = Date();
                    ping_res[trace_ip].push({
                        "dest":trace_ip,
                        "date":date_ob,
                        "rtt":ms
                    })                            
                })
                .catch(e => {
                    console.log(e)
                })
        }, 1000 * ping_intervals)
    });
    setTimeout(() =>{
        iperf_handler("", Date());    
        console.log("iperf done");
                
    }, ping_clock_before * 1000);
    setTimeout(() =>{
        clearTimeout(ping_timer);       

        for(var k in ping_res) {
            const json2csvParser = new Parser();
            csver = json2csvParser.parse(ping_res[k]);
            fs.writeFileSync(path_maker + k.toString() + ".csv", csver);
        }
        console.log("test done!");
        
    }, (ping_clock_after + ping_clock_before) * 1000);
    
    
}
function iperf_handler(iperf_ip, text_file_name) {
    exec('iperf3 -c ' + iperf_ip + " -J > " + save_dir + text_file_name + ".txt");
}
function trace_plus_ping(dest, trace_count){
    //add date to path
    path_maker = save_dir + "test" + test_counter.toString() 
    + "_" + (ping_clock_before + ping_clock_after + iperf_clock).toString() + "sec_" 
    + "/" ;
    exec("mkdir " + path_maker);
    test_counter++;

    console.log(path_maker);        
    if (trace_res.length == 0){
        p.traceRoute (dest, trace_count, feedCb, doneCb);   
    }
    else {
        ping_traces();
    }
}
function init_ping(dest, trace_count){
    p.traceRoute (dest, trace_count, feedCb, doneCb2);   
}
function uptrace(){
    p.traceRoute (dest, trace_count, feedCb, doneCb3);
}
module.exports = {trace_plus_ping, init_ping}