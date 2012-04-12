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
  res.sendfile("public/tmp/message.png");
  
  /*  fs.readFile("public/tmp/message.png", "binary", function(error, file) {
      if(error) {
        res.send(error)
      } else {
        res.send("{\"data\":\"" + file + "\"}");
      }
    });*/
});

Server.post('/upload', function(req, res){
  base64Data = req.body.obj.replace(/^data:image\/png;base64,/,""),
  dataBuffer = new Buffer(base64Data, 'base64');

  fs.writeFile('public/tmp/message.png', dataBuffer, function(err) {
    if (err) {
      console.log(err);
      return;
    }
  });

  res.send("Screenshot saved!");
});

// start server
Server.listen(AppConfig.Port);