const save_dir = "./results/";

// ping settings
let ping_intervals = 1;

// trace destinsation and depth
let destination = '8.8.8.8';
let trace_depth = 4;

// braodcast ip range and port
var PORT = 6024;
var BROADCAST_ADDR = "192.168.10.255";

// test settings
let iperf_duration = 10;
let iperf_interval = 50;
let iperf_dist = 12;

//iperf settings
let iperf_port_address = "5201";
let iperf_server_address = "192.168.1.101";
let iperf_dest_file = "iperf_results";

//sycn server
let sync_addr = '192.168.43.158';
let sync_port = 6024;

module.exports = {save_dir, ping_intervals, iperf_server_address, iperf_dest_file, 
    destination, trace_depth, PORT, BROADCAST_ADDR, iperf_port_address, iperf_interval, iperf_dist,
    sync_addr, sync_port}
