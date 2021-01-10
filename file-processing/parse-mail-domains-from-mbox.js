var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream');
var regex = /^From.*\<.*@(.*)\>.*$|^From .*@(.*) .*$/g;
var domains = []

var instream = fs.createReadStream('./Posteingang.mbox');
var outstream = new stream;
outstream.readable = true;
outstream.writable = true;

var rl = readline.createInterface({
    input: instream,
    output: outstream,
    terminal: false
});



rl.on('line', function(line) {
    var match = regex.exec(line);
    if(match && line.indexOf("xxx")==-1){
        let d = match[1];
        if(domains.indexOf(d)==-1) {
        console.log(d);
        domains.push(d)
           }
    }
});
