var Kinect = {
  init : function(){
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

    if (support == null) {
        alert("Your browser cannot support WebSocket!");
        return;
    }

    // create a new websocket and connect
    var ws = new window[support]('ws://127.0.0.1:2011/sample');

    // when data is comming from the server, this metod is called
    ws.onmessage = function (evt) {
      try {
        var _data = $.parseJSON(evt.data);
        InteractionModel  = InteractionModelTypes.InteractionModelTypeKinect;
        //var kinesis = new Kinesis("kinesis event");
        kinesis.initialize(_data);
        
      } catch (error){
        // console.info(evt.data);
        // parsing exception
      }

    };

    // when the connection is established, this method is called
    ws.onopen = function () {
      console.info("Connection Opened");
    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
      console.info("Connection Closed");
    }
  }
}