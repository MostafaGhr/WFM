const { Parser } = require('json2csv');
const fs = require("fs");
const { exec } = require('child_process');
const express = require('express');
const app = express();

const myfunc = require('./depend.js');

const save_dir = "/home/mostafa/WFM/results/";
const ping_dest = '8.8.8.8';
const trace_count = 4;

exec('mkdir ' + save_dir);

//save in 
// myfunc.init_ping(ping_dest, trace_count);

var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    if (d.toString().trim() == "save"){
        for(var k in ping_res) {
            const json2csvParser = new Parser();
            csver = json2csvParser.parse(ping_res[k]);
            fs.writeFileSync(save_dir + k.toString() + ".csv", csver);
        }
        console.log("done!");
    }
  });

app.get('/list', function(req, res){
    fs.readdir(save_dir, function(err, items) {   
        html_ret = "";   
        for (var i=0; i<items.length; i++) {
            if(items[i].substr(items[i].length - 4) == ".txt" || items[i].substr(items[i].length - 4) == ".csv"){
                html_ret += "<a href=/download/?dl=" + items[i]+ ">" + items[i] + "</a><br>";
            }
        }
        res.send(html_ret);
    });    
});

app.get('/download', function(req, res){
    let url = req.query.dl;
    res.download(save_dir + "/" + url); // Set disposition and send it.
});

app.get('/uptrace', (req, res) =>{
    myfunc.uptrace();
});

app.get('/start', function(req, res){ 
    myfunc.trace_plus_ping(ping_dest, trace_count);
    console.log("test started");
    
    res.send("test initiated!");
});

app.listen(3000, () => console.log('App listening on port 3000!'));


