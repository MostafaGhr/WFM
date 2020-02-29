const http = require('http');
const settings = require('./../config.js')

function send_uptrace(ip_list){
    ip_list.forEach(rasp_ip => {
        options = {
            host: rasp_ip,
            port: 3000,
            path: '/uptrace',
            method: 'GET'
            };
        var req = http.request(options, res => {
            if(res.statusCode == 200){
                console.log(options.host + " has confirmed " + options.path + " requset!");
                
            }
            // res.on('data', d => {
            //     process.stdout.write(d)
            // })
        })
        req.on('error', error => {
            console.error(error)
        })
        
        
        req.end()
    });
}
function send_start(ip_list){
    ip_list.forEach(rasp_ip => {
        options = {
            host: rasp_ip,
            port: 3000,
            path: '/teststart',
            method: 'GET'
            };
        var req = http.request(options, res => {
            if(res.statusCode == 200){
                console.log(options.host + " has confirmed " + options.path + " requset!");
                
            }
            // res.on('data', d => {
            //     process.stdout.write(d)
            // })
        })
        req.on('error', error => {
            console.error(error)
        })
        req.end()
    });
}
module.exports = {send_uptrace, send_start}
