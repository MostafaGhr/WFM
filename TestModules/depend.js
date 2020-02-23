const { exec } = require('child_process');
const { Parser } = require('json2csv');
const fs = require("fs");
traceroute = require('traceroute');
var ping = require('ping');
settings = require('./../config.js');

let ping_res = {};
let trace_res = [];

let ping_timers=[];


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

// clear initial pings
function clear_ping(){
    clearTimeout(ping_timers);
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

// needs more input args
function iperf_handler() {
    let date_ob = Date();
    date_ob = date_ob.split(" ").join("_");
    date_ob = date_ob.replace("(", "");
    date_ob = date_ob.replace(")", "");
    let iperf_path = settings.save_dir + settings.iperf_dest_file + "/";
    exec("mkdir " + iperf_path);

    // command to execute!
    let comm = 'iperf3 -c ' + settings.iperf_server_address + " -J > " + iperf_path + date_ob + ".txt";
    
    console.log(comm);

    exec(comm, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            console.log(stdout);
            console.log(stderr);   
        }
        console.log("iperf done!");
        
    })

}

module.exports = {trace_plus_ping, init_ping, trace_update, iperf_handler}