var app = require('express');
var http = require('http');
var fs = require('fs');

var createServer = http(function(req,res){
    res.send(console.log('hello'));
}).listen(8080);
