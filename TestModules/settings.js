const save_dir = "./results/";


let ping_intervals = 1;
let ping_clock_before = 5;
let iperf_clock = 1;
let ping_clock_after = 5;
let iperf_server_address = "172.21.33.189";
let iperf_dest_file = "iperf_test";

let destination = '8.8.8.8';
let trace_depth = 4;

// request.js
var PORT = 6024;
var BROADCAST_ADDR = "192.168.43.255";

module.exports = {save_dir, ping_intervals, ping_clock_before, 
    iperf_clock, ping_clock_after, iperf_server_address, iperf_dest_file, destination, trace_depth,
    PORT, BROADCAST_ADDR}