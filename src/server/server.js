var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var routes = require('./routes');

var expressJwt = require('express-jwt');

// We are going to protect /api routes with JWT
app.use('/secure', expressJwt({secret: 'secret'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '4mb'}));

routes(app);

var server = require('http').createServer(app);

server.listen(3000);


var game = require('./game')(server);