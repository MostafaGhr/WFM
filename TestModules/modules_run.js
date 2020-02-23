const fs = require("fs");
const { exec } = require('child_process');
const express = require('express');
const app = express();

settings = require('./../config.js');
myfunc = require('./depend.js');
cast = require('./request.js');

exec('mkdir ' + settings.save_dir);
myfunc.trace_update();

myfunc.iperf_handler();
// cast.send_broadcast();

myfunc.init_ping();

app.get('/list',(req, res) => {
    html_ret = "<h1>Ping results</h1>"; 
    fs.readdir(settings.save_dir, function(err, items) {     
        for (var i=0; i<items.length; i++) {
            if(items[i].substr(items[i].length - 4) == ".txt" || items[i].substr(items[i].length - 4) == ".csv"){
                html_ret += "<a href=/download/?dl=" + items[i]+ ">" + items[i] + "</a><br>";
            }
        }

        html_ret += "<br><br><h1>Iperf results</h1><br>";
    });    
    fs.readdir(settings.save_dir + "/iperf_results", function(err, items) {   
        for (var i=0; i<items.length; i++) {
            if(items[i].substr(items[i].length - 4) == ".txt" || items[i].substr(items[i].length - 4) == ".csv"){
                html_ret += "<a href=/download/?dl=iperf_results/" + items[i]+ ">" + items[i] + "</a><br>";
            }
        }
        res.send(html_ret);
    });
});

app.get('/download',(req, res) => {
    let url = req.query.dl;
    res.download(settings.save_dir + "/" + url); // Set disposition and send it.
});

app.get('/updatetrace', (req, res) =>{
    myfunc.trace_update();
    res.send("trace updated!")
});

app.get('/teststart',(req, res) => { 
    myfunc.trace_plus_ping();
    console.log("test started");
    
    res.send("test initiated!");
});

app.get('/pingstop',(req, res) => { 
    myfunc.clear_ping();
    console.log("pinging stoped");
    
    res.send("pinging stoped!");
});

app.listen(3000, () => console.log('App listening on port 3000!'));


