// *Version 0.1*    
//    
// Kinect.js is the class responsible for connecting to the Kinesis Windows service which interacts directly with the Kinect
var Kinect = function() {
  lastPosX = null;
  lastPosY = null;
  lastPosZ = null; 
  
  lastDirection = null;
  state = "";
  
  gestureTimer = null;
  
  retryCount = 0;
  addMessageBar();
  connectionOpened = false;
  
  Kinect.onConnectionError   = function() {
    updateMessageBar(KinesisMessages.ServerNotConnected, true);
  };
  Kinect.onConnectionSuccess = function() {
    updateMessageBar(KinesisMessages.ServerConnected, false);
    updateMessageBar(KinesisMessages.KinectNotConnected, true);
  };
  
  Kinect.resetState = function() {
    console.info(state);
    state = "";
    lastPosX = lastPosY = lastPosZ = null;
  };
  
  Kinect.outputCodes = function(currentPos) {
    var output = "";
    var x=currentPos.x,
        y=currentPos.y,
        z=currentPos.z;
        
    if (lastPosX === null) {
      lastPosX = x;
      lastPosY = y;
      lastPosZ = z;
      return this;
    }
    
    // console.info(lastPosX +" " +x);
    
    var dx = Math.abs(lastPosX - x);
    var dy = Math.abs(lastPosY - y);
    var dz = Math.abs(lastPosZ - z);
    
    if (dx < 10 && dy < 10 && dz < 10){
      return this;
    }
    
    if (gestureTimer != undefined)
      clearTimeout(gestureTimer);
    
    if (dx > dy && dx > dz) {
      output += (x < lastPosX) ? "L" : "R";
    }
    
    if (dy > dx && dy > dz) {
      output += (y < lastPosY) ? "U" : "D";
    }
    
    if (dz > dx && dz > dy) {
      output += (z < lastPosZ) ? "I" : "O";
    }
    
    lastPosX = x;
    lastPosY = y;
    lastPosZ = z;
    
    if (lastDirection === null || lastDirection != output) {
      lastDirection = output;
      state += output;
    }
    
    gestureTimer = setTimeout("Kinect.resetState()", 1000);
  };
  
  Kinect.prototype.init = function(){
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
    
    // Only if the browser being used does not support WebSockets
    if (support == null) {
      log("Your browser cannot support WebSockets!");
      return;
    }
    
    // Create a new websocket and connect
    var ws = new window[support]('ws://192.168.0.8:2011/');

    // Called only when any data comes from 
    ws.onmessage = function (evt) {
      try {
        var _data = JSON.parse(evt.data);
        redrawFigure(_data);
        // if(_data.Kinect != undefined) {
        //   if(_data.Kinect == "Connected") {
        //     updateMessageBar(KinesisMessages.KinectConnected, false);
        //     Kinesis.kinectStatus = true;
        //   }
        //   else {
        //     updateMessageBar(KinesisMessages.KinectNotConnected, true);
        //     Kinesis.kinectStatus = false;
        //   }
        //   Kinesis.onStatusChange(_data.Kinect);
        // };
        
        // if (_data.depthImage != undefined) {
        //    Kinesis.updateDepthImage(_data.depthImage);
        // }
        
        // if (_data.cursor != undefined) {
        //   Kinect.outputCodes(_data.cursor);
        //   GestureListener.mouseMove({ x: Layout.pageSize.width * _data.cursor.x / 100, y: Layout.pageSize.height * _data.cursor.y *1.5/ 100, z:_data.cursor.z });
        //   
        // }
        // kinesis.initialize(_data);
        
      } catch (error){
        /* console.info(evt.data);
         parsing exception*/
      }

    };

    // After the connection is established, the method is called
    ws.onopen = function () {
      retryCount = 0;
      connectionOpened = true;
      Kinect.onConnectionSuccess();
      log("Connection Opened");
    };

    // After the connection is closed, the method is called
    ws.onclose = function () {
      if (connectionOpened) {
        connectionOpened = false;
        Kinect.onConnectionError();
      }
      else
        log("Connection Closed");
      retryOpeningWebSocket();
    };
    
    window.onbeforeunload = function() {
      ws.close();
    };
  };
  
  var retryOpeningWebSocket = function() {
    retryCount++;
    if(retryCount < 10 )
      Kinect.prototype.init();
    else {
      if (retryCount == 10)
        updateMessageBar(KinesisMessages.ServerNotConnected, true);
    }
  };
};

// Window Onload event to initialize everything. This method is defined in the Kinesis.js file.
window.onload = init;