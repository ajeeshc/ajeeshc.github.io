// server.js
var port = 8182;
var express = require('express');
var http = require('http');
var app = express();
app.use(express.static(__dirname + '/..'));
http.createServer(app).listen(port);