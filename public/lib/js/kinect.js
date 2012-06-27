// *Version 0.1*    
//    
// Kinect.js is the class responsible for connecting to the Kinesis Windows service which interacts directly with the Kinect
var Kinect = function() {  
  joints = new Array(20);
  $(joints).each(function(i) {
    joints[i] = {
                  'jointId'       : i,
                  'lastPosX'      : null,
                  'lastPosY'      : null,
                  'lastPosZ'      : null, 

                  'state'         : "",
                  'lastDirection' : null,
                  'gestureTimer'  : null
                };
  });
  
  retryCount = 0;
  // addMessageBar();
  connectionOpened = false;
  
  Kinect.onConnectionError   = function() {
    updateMessageBar(KinesisMessages.ServerNotConnected, true);
  };
  Kinect.onConnectionSuccess = function() {
    updateMessageBar(KinesisMessages.ServerConnected, false);
    updateMessageBar(KinesisMessages.KinectNotConnected, true);
  };
  
  Kinect.resetState = function(i) {
    var joint = joints[i];
    // console.info("Joint: "+i + "  " +joint.state);
    joint.state = "";
    joint.lastPosX = joint.lastPosY = joint.lastPosZ = null;
  };
  
  Kinect.outputCodes = function(allData) {
    $(allData[0]).each(function(i) {
      currentJoint = joints[i];
      var output = "";
      var x=allData[0][i][0],
          y=allData[0][i][1],
          z=allData[0][i][2];
        
      if (currentJoint.lastPosX === null) {
        currentJoint.lastPosX = x;
        currentJoint.lastPosY = y;
        currentJoint.lastPosZ = z;
        return this;
      }
    
      // console.info(lastPosX +" " +x);
    
      var dx = Math.abs(currentJoint.lastPosX - x);
      var dy = Math.abs(currentJoint.lastPosY - y);
      var dz = Math.abs(currentJoint.lastPosZ - z);
    
      if (dx < 20 && dy < 20 && dz < 20){
        return this;
      }
    
      if (currentJoint.gestureTimer != undefined)
        clearTimeout(currentJoint.gestureTimer);
    
      if (dx > dy && dx > dz) {
        output += (x < currentJoint.lastPosX) ? "L" : "R";
      }
    
      if (dy > dx && dy > dz) {
        output += (y < currentJoint.lastPosY) ? "U" : "D";
      }
    
      if (dz > dx && dz > dy) {
        output += (z < currentJoint.lastPosZ) ? "I" : "O";
      }
    
      currentJoint.lastPosX = x;
      currentJoint.lastPosY = y;
      currentJoint.lastPosZ = z;
      
      // console.log(currentJoint.lastPosX + " " +currentJoint.lastPosY + " "+currentJoint.lastPosZ );
    
      if (currentJoint.lastDirection === null || currentJoint.lastDirection != output) {
        currentJoint.lastDirection = output;
        currentJoint.state += output;
      }
    
      currentJoint.gestureTimer = setTimeout("Kinect.resetState("+i+")", 2000);
    });
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
         Kinect.outputCodes(_data);
         redrawFigure(_data);        
        
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