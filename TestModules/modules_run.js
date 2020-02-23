const fs = require("fs");
const { exec } = require('child_process');
const express = require('express');
const app = express();

settings = require('./../config.js');
myfunc = require('./depend.js');
cast = require('./request.js');

exec('mkdir ' + settings.save_dir);
myfunc.trace_update();

//save in 
// cast.send_broadcast();

myfunc.init_ping();

app.get('/list',(req, res) => {
    fs.readdir(settings.save_dir, function(err, items) {   
        html_ret = "";   
        for (var i=0; i<items.length; i++) {
            if(items[i].substr(items[i].length - 4) == ".txt" || items[i].substr(items[i].length - 4) == ".csv"){
                html_ret += "<a href=/download/?dl=" + items[i]+ ">" + items[i] + "</a><br>";
            }
        }
        res.send(html_ret);
    });    
});

app.get('/download',(req, res) => {
    let url = req.query.dl;
    res.download(settings.save_dir + "/" + url); // Set disposition and send it.
});

app.get('/uptrace', (req, res) =>{
    myfunc.trace_update();
    res.send("trace updated!")
});

app.get('/start',(req, res) => { 
    myfunc.trace_plus_ping();
    console.log("test started");
    
    res.send("test initiated!");
});

app.listen(3000, () => console.log('App listening on port 3000!'));


