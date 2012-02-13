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
        InteractionModel = InteractionModelTypes.InteractionModelTypeKinect;

        if (_data.right != undefined) {
          Gestures.mouseMove({ x: Layout.pageSize.width * _data.right.x / 100, y: Layout.pageSize.height * _data.right.y / 100 });
        } else if (_data.speech != undefined) {
          Speech.recognize(_data.speech);
        } else if (_data.user != undefined) {
          if (_data.user){
            $('.info').addClass('loggedin');
          } else {
            $('.info').removeClass('loggedin');
          }
        }
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