// *Version 0.1*    
//    
// Kinesis.js is the base class which is managing all the added gestures and handling the events recieved from Kinect.js    
// Depends on the Kinect class
function Kinesis() {
  // Where all the gestures added will be stored  
  Kinesis.kinectStatus = false;
  Kinesis.gestureDetection = true;  
  Kinesis.pollInterval = 2000;
  Kinesis.gestures = [];
  Kinesis.cursor   = null;
  Kinesis.lastElement = [];
  Kinesis.holdEventDelay = 4000;	
  Kinesis.clickEventTimer = null;
  Kinesis.debug = false;
  Kinesis.prototype.keyword       = "KINESIS WINDOW ONE";
  // When multiple gestures can work in a predefined order
  Kinesis.prototype.is_series     = false;
  // When multiple gestures can work simultaneously to fire an event
  Kinesis.prototype.is_parallel   = true;
  Kinesis.prototype.streamCounter = 0;
  Kinesis.prototype.canvas        = "#kinesis";

  Kinesis.pointer = null;
  
	// This is called whenever a new instance of the class is created     
	// *Parameter is the parsed JSON String which comes from the Kinect Class*    
  this.initialize = function(data) {
    if( Kinesis.gestureDetection == true && data )
      this.matchGestures(data);
  };
  
  Kinesis.onStatusChange = function(message) {
    console.info(message);
  };
  
  Kinesis.updateDepthImage = function(depthImage) {
    var depthImage = document.getElementById('depthImage');
    depthImage.src = "data:image/png;base64," + depthImage;
  };
	
	// Responsible for binding gestures to be matched when events are recieved from Kinect.js    
	// *Parameter is an object of the Gesture Class*    
  Kinesis.prototype.addGesture	= function(gesture) {
	  Kinesis.gestures.push(gesture);
	};

  Kinesis.prototype.setStream		= function() {
    
  };

  Kinesis.prototype.resetStream	= function() {
    
  };

  // Responsible for matching the recieved event from Kinect class with the already binded gestures    
  // *Parameter contains the parsed JSON event from the Kinect Class*
  Kinesis.prototype.matchGestures= function(data) {
    
    if (data.gestures[0] != undefined) {
      eventType  = data.gestures[0].type;
      joints     = data.gestures[0].joints;
      direction  = [data.gestures[0].direction];
      accuracy   = data.gestures[0].accuracy;
      if (data.gestures[0].origin != undefined) {
        origin  = {};
        origin.x = data.gestures[0].origin.x;
        origin.y = data.gestures[0].origin.y;
        origin.z = data.gestures[0].origin.z; 
      }
    }
    
    if (data.cursor != undefined) {
      positionX = data.cursor.x;
      positionY = data.cursor.y;
      positionZ = data.cursor.z; 
    }
    
    for(index in Kinesis.gestures) {
      gesture = Kinesis.gestures[index];
      // Gesture Matching conditions
      if (checkBounds(origin, gesture.bounds)) {
        if (gesture.gestureType == eventType) {
          log("Gesture Detected");
          if ((joints.intersect(gesture.joints)).length > 0) {
            log("Allowed Joint Detected");
            if ((direction.intersect(gesture.directions)).length > 0) {
              log("Allowed Direction Detected");
              gesture.toFire(gesture);
              break;
            }
            else {
              log("Direction did not match");
              continue;
            }
          }
          else {
            log("Joint did not match");
            continue;
          }
        }
        else {
          log("Gesture not found");
          continue;
        }
      }
      else {
        continue;
      }
      // Gesture matching ends
    }
    setKinesisTimer();
  };
}

function checkBounds(origin, bounds) {
  var matched = true;
  if ((bounds.min == null && bounds.max == null))
    log("No bounds specified for gesture");
  else {
    if (bounds.min ==  null || (bounds.min.x <= origin.x && bounds.min.y <= origin.y && bounds.min.z <= origin.z))
      log("Minimum bounds satisfied");
    else {
      log("Minimum bounds not satisfied");
      matched = false;
    }
    if (bounds.max ==  null || (bounds.max.x >= origin.x && bounds.max.y >= origin.y && bounds.max.z >= origin.z))
      log("Max bounds satisfied");
    else {
      log("Max bounds not satisfied");
      matched = false;
    }
  }
  return matched;
};

function setKinesisTimer() {
  log("Gesture Listener Timeout");
  Kinesis.gestureDetection = false;
  setTimeout("resetKinesisTimer()", Kinesis.pollInterval);
};

function resetKinesisTimer() {
  log("Gesture Listener Timer Started");
  Kinesis.gestureDetection = true;
};

// Compute the intersection of n arrays
// *Parameter is an Array of N Arrays being sent to it*   
// *Returns back a single array which is an intersection of all arrays*    
Array.prototype.intersect =
  function() {
    if (!arguments.length)
      return [];
    var a1 = this;
    var a = a2 = null;
    var n = 0;
    while(n < arguments.length) {
      a = [];
      a2 = arguments[n];
      var l = a1.length;
      var l2 = a2.length;
      for(var i=0; i<l; i++) {
        for(var j=0; j<l2; j++) {
          if (a1[i] === a2[j])
            a.push(a1[i]);
        }
      }
      a1 = a;
      n++;
    }
    return a.unique();
  };


// Return a new array with duplicate values removed    
// *Parameter is an array from which the duplicates are to be removed*   
// *Returns a single array with duplicates removed*    
Array.prototype.unique =
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };

// Used to keep track of the cursor hold position. Note that cursor is essentially the hand position being sent from the Kinesis Server
var cursorTimer = null;

// Activates the cursor timer which happens only when the hand pointer stops over a DOM element with class "interactive". Animation is also added to give feedback to the user.   
// *Parameter is the canvas element "cursor"*    
// *Returns back the canvas element.*   
function activateCursorTimer(me){
  var canvas = me;
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  var radius = 30;
  var startingAngle = -0.5 * Math.PI;
  var incrementAngle = startingAngle;
  var endingAngle = 1.5 * Math.PI;
  var counterclockwise = false;
  
  var context = canvas.getContext("2d");
  
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 3;
  context.shadowBlur    = 8;
  context.shadowColor   = 'rgba(0, 0, 0, 0.5)';

  if(cursorTimer){
    clearInterval(cursorTimer);
  }

  cursorTimer=setInterval(function(){
    context.clearRect(0, 0, 100, 100);
    if (incrementAngle > endingAngle){
      incrementAngle = startingAngle;
    }
    else
    {
      incrementAngle = incrementAngle + (0.05 * Math.PI)
    }
// Draw loading around the canvas element
    context.beginPath();
    context.arc(centerX, centerY, radius, startingAngle, incrementAngle, counterclockwise);
    context.lineWidth = 8;
    context.strokeStyle = 'E5F3F9';
    context.stroke();
    context.closePath();
  }, 50);
  
  return me;
}

// Deactivates the cursor timer when either the hand pointer was moved out of the "interactive" DOM element, or the event is fired.   
// *Parameter is the canvas element
// *Returns back the canvas element
function deactivateCursorTimer(me){
  if(cursorTimer){
    clearInterval(cursorTimer);
  }
  var canvas = me;
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, 100, 100);
  return me;
}  
  
// *Layout Class*    
// Responsible for setting the layout of the page correctly. This can easily be overridden to incorporate the views
function Layout() {
  Layout.pageSize = { width: window.innerWidth, height: window.innerHeight };
};

function insertCursor() {
  var _cursor     = document.createElement('canvas');
  _cursor.id      = 'cursor';
  _cursor.width   = '100';
  _cursor.height  = '100';
  var hand = document.createElement('div');
  hand.id = 'hand';
  
  _cursor.appendChild(hand);
  
  document.body.appendChild(_cursor);
  Kinesis.pointer = document.getElementById('cursor');
};

function insertDepthImage() {
  var _depthImage     = document.createElement('img');
  _depthImage.id      = 'depthImage';
  _depthImage.width   = '64';
  _depthImage.height  = '48';
  document.body.appendChild(_depthImage);
};

var originalInit = window.onload;

// Initialize the Layout and Kinect Classes
function init() {
  setTimeout(function(){
    insertCursor();
    insertDepthImage();
    myLayout = new Layout();
    kinect = Kinect();
    Kinect.prototype.init();
    if(originalInit)
    	originalInit();
  }, 10);
};

function log(obj){
  if(Kinesis.debug)
    console.info(obj);
}