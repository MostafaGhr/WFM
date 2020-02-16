const { exec } = require('child_process');
const { Parser } = require('json2csv');
const fs = require("fs");
traceroute = require('traceroute');
var ping = require('ping');
settings = require('./settings.js');

let ping_res = {};
let trace_res = [];

let ping_timer;
let test_counter = 0;
let path_maker = "";

// let pinger = (ip) => {
//     return new Promise((resolve, reject) => {
//         p.pingHost(ip, (error, target, sent, rcvd) => {
//             if(!error){
//                 resolve(rcvd - sent);
//             } else {
//                 reject(new Error(error))
//             }
//         })
//     })   
// }
let pinger = (ip) => {
    return new Promise((resolve, reject) => {
        ping.promise.probe(ip)
                    .then((res) => {
                        resolve(res.time);
                    })
                .catch(e => {
                    console.log(e)
                })
    })   
}
function ping_traces1(){    
    trace_res.forEach(trace_ip => {
        ping_timer = setInterval(() => {
                ping.promise.probe(trace_ip)
                    .then((res) => {
                        console.log(ping_res);
                        
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
                            "rtt":res.time
                        }) 
                    })
                    .catch(e => {
                        console.log(e)
                    })
        }, 1000 * settings.ping_intervals)
    })
    
    setTimeout(() =>{
        iperf_handler("", Date());    
        console.log("iperf done");
                
    }, settings.ping_clock_before * 1000);
    setTimeout(() =>{
        clearTimeout(settings.ping_timer);       

        for(var k in ping_res) {
            const json2csvParser = new Parser();
            csver = json2csvParser.parse(ping_res[k]);
            fs.writeFileSync(path_maker + k.toString() + ".csv", csver);
        }
        console.log("test done!");
        
    }, (settings.ping_clock_after + settings.ping_clock_before) * 1000);
    console.log(ping_res);
    
}
function ping_traces(){    
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
        }, 1000 * settings.ping_intervals)
    })
    
    setTimeout(() =>{
        iperf_handler("", Date());    
        console.log("iperf done");
                
    }, settings.ping_clock_before * 1000);
    setTimeout(() =>{
        clearTimeout(settings.ping_timer);       

        for(var k in ping_res) {
            const json2csvParser = new Parser();
            csver = json2csvParser.parse(ping_res[k]);
            fs.writeFileSync(path_maker + k.toString() + ".csv", csver);
        }
        console.log("test done!");
        
    }, (settings.ping_clock_after + settings.ping_clock_before) * 1000);
    console.log(ping_res);
    
}
function trace_plus_ping(){
    //add date to path
    path_maker = settings.save_dir + "test" + test_counter.toString() 
    + "_" + (settings.ping_clock_before + settings.ping_clock_after + settings.iperf_clock).toString() + "sec" 
    + "/" ;
    exec("mkdir " + path_maker);
    test_counter++;       
    if (trace_res.length == 0){
        console.log("trace list empty, performing traceroute!");
        trace_update();
    }
    else {
        console.log(trace_res);
        
        ping_traces();
    }
}
function iperf_handler() {
    console.log('iperf3 -c ' + settings.iperf_server_address + " -J > " + path_maker + settings.iperf_dest_file + ".txt");
    
    exec('iperf3 -c ' + settings.iperf_server_address + " -J > " + path_maker + settings.iperf_dest_file + ".txt");
}
function init_ping(){
}
function trace_update(){
    trace_res=[];
    traceroute.trace(settings.destination, (err,hops) => {
        if (!err) {
            for(var k in hops){
                if(k > settings.trace_depth)
                    break;
                if(Object.keys(hops[k]) != false){
                    trace_res.push(Object.keys(hops[k])[0]);
                }
            }
        }
          
    });
}
module.exports = {trace_plus_ping, init_ping, trace_update}