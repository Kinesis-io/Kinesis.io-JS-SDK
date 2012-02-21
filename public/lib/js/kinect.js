// *Version 0.1*    
//    
// Kinect.js is the class responsible for connecting to the Kinesis Windows service which interacts directly with the Kinect
var Kinect = function() {
  //
  Kinect.prototype.init = function(){
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
    
    // Only if the browser being used does not support WebSockets
    if (support == null) {
        alert("Your browser cannot support WebSocket!");
        return;
    }

    // Create a new websocket and connect
    var ws = new window[support]('ws://127.0.0.1:2011/sample');

    // Called only when any data comes from 
    ws.onmessage = function (evt) {
      try {
        var _data = JSON.parse(evt.data);
        if(_data.Kinect != "undefined") {
          if(_data.Kinect == "Connected")
            Kinesis.kinectStatus = true;
          else
            Kinesis.kinectStatus = false;
          Kinesis.onStatusChange(_data.Kinect);
        };
        
        if (_data.cursor != "undefined") {
          GestureListener.mouseMove({ x: Layout.pageSize.width * _data.cursor.x / 100, y: Layout.pageSize.height * _data.cursor.y *1.5/ 100, z:_data.cursor.z });
        }
        kinesis.initialize(_data);
        
      } catch (error){
        /* console.info(evt.data);
         parsing exception*/
      }

    };

    // After the connection is established, the method is called
    ws.onopen = function () {
      console.info("Connection Opened");
    };

    // After the connection is closed, the method is called
    ws.onclose = function () {
      console.info("Connection Closed");
    }
  }
};

// Window Onload event to initialize everything. This method is defined in the Kinesis.js file.
window.onload = init;