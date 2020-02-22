const http = require('http');

function send_uptrace(ip_list, timer){    
    setInterval(() => {
        console.log(ip_list);
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
    }, timer);
}
function send_start(ip_list, timer){    
    setInterval(() => {
        console.log(ip_list);
        ip_list.forEach(rasp_ip => {
            options = {
                host: rasp_ip,
                port: 3000,
                path: '/start',
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
    }, timer);
}
module.exports = {send_uptrace, send_start}
