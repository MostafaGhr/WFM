const { exec } = require('child_process');
const { Parser } = require('json2csv');
const fs = require("fs");
traceroute = require('traceroute');
var ping = require('ping');
settings = require('./settings.js');

let ping_res = {};
let trace_res = [];

let ping_timers=[];
let test_counter = 0;
let path_maker = "";

// deprecated
function ping_traces(){
    trace_res.forEach(trace_ip => {
        ping_timers.push(setInterval(() => {
            ping.promise.probe(trace_ip)
                .then((res) => {                    
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
        }, 1000 * settings.ping_intervals))
    })
    
    setTimeout(() =>{
        iperf_handler("", Date());    
        console.log("iperf done");
                
    }, settings.ping_clock_before * 1000);
    setTimeout(() =>{
        ping_timers.forEach(timer => {
            clearTimeout(timer);
        });       

        for(var k in ping_res) {
            const json2csvParser = new Parser();
            csver = json2csvParser.parse(ping_res[k]);
            fs.writeFileSync(path_maker + k.toString() + ".csv", csver);
        }
        console.log("test done!");
        
    }, (settings.ping_clock_after + settings.ping_clock_before) * 1000);
    
}

// deprecated
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
        console.log("trace list is: " + trace_res);
        
        ping_traces();
    }
}

// needs more input args
function iperf_handler() {
    console.log('iperf3 -c ' + settings.iperf_server_address + " -J > " + path_maker + settings.iperf_dest_file + ".txt");
    
    exec('iperf3 -c ' + settings.iperf_server_address + " -J > " + path_maker + settings.iperf_dest_file + ".txt");
}

// fixed and running
function init_ping(){
    setTimeout(() => {
        trace_res.forEach(trace_ip => {
            ping_timers.push(setInterval(() => {
                ping.promise.probe(trace_ip)
                    .then((res) => {                    
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
                        if (fs.existsSync(settings.save_dir + trace_ip + ".csv")) {
                            const json2csvParser = new Parser({ header: false });
                            csver = json2csvParser.parse({
                                "dest":trace_ip,
                                "date":date_ob,
                                "rtt":res.time
                            });
                            fs.appendFileSync(settings.save_dir + trace_ip.toString() + ".csv", csver + "\r\n");
                        }
                        else{
                            const json2csvParser = new Parser({ header: true });
                            csver = json2csvParser.parse({
                                "dest":trace_ip,
                                "date":date_ob,
                                "rtt":res.time
                            });
                            fs.writeFileSync(settings.save_dir + trace_ip.toString() + ".csv", csver + "\n\r");
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }, 1000 * settings.ping_intervals))
        })
    }, 5000)
    
}

// update traceroutes
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