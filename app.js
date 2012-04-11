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
    fs.readFile("message.png", "binary", function(error, file) {
      if(error) {
        res.send(error)
      } else {
        //res.send(file);
        //res.header('Content-Type', 'image/png');
        res.send("<img src=\"" + file + "\" />");
      }
    });
});

Server.post('/upload', function(req, res){
  fs.writeFile('message.png', req.body.obj, function (err) {
    if (err) {
      console.log(err);
      return;
    }
      console.log('It\'s saved!');
  });
  res.send("Screenshot saved!");
});

// start server
Server.listen(AppConfig.Port);