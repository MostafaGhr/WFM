const http = require('http');
const settings = require('./../config.js')

options = {
    host: settings.sync_addr,
    port: settings.sync_port,
    path: '/hello',
    method: 'GET'
    
};
function sender(){
    setInterval(() => {
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
    }, 10000)
    
}


module.exports = {sender}