var express   = require('express');
var Server    = express.createServer();
var AppConfig = require('./config.js');
var formidable = require('formidable');
var fs = require('fs');
// server config
setHeaders = function (req,res,next) {
  res.header("X-Powered-By","Kinesis.IO");
  next();
}

Server.configure(function(){
  Server.use(express.bodyParser());
  
  Server.set('views', __dirname + '/app/views');
  Server.set('view engine', 'ejs');
  Server.use(express.static(__dirname + '/public'));
  Server.use(express.directory(__dirname + '/public'));
  Server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  Server.use(setHeaders);
  Server.use(Server.router); 
});

Server.get('/file', function(req, res) {
    fs.readFile("public/tmp/message", "binary", function(error, file) {
      if(error) {
        res.send(error)
      } else {
        res.send("<img src=\"" + file + "\" />");
      }
    });
});

Server.post('/upload', function(req, res){
  fs.writeFile('public/tmp/message', req.body.obj, function (err) {
    if (err) {
      console.log(err);
      return;
    }
  });
  res.send("Screenshot saved!");
});

// start server
Server.listen(AppConfig.Port);