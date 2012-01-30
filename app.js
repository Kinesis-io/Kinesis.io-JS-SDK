var express   = require('express');
var Server    = express.createServer();
var AppConfig = require('./config.js');

// server config
setHeaders = function (req,res,next) {
  res.header("X-Powered-By","Kinesis.IO");
  next();
}

Server.configure(function(){
  Server.set('views', __dirname + '/app/views');
  Server.set('view engine', 'ejs');
  Server.use(express.static(__dirname + '/public'));
  Server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  Server.use(setHeaders);
});

// application paths
Server.get('/', function(req, res){
  res.send('Kiosk Server Running');
});

// start server
Server.listen(AppConfig.Port);