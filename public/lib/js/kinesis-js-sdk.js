// CONSTANTS JS STARTS

//*Version 0.1*   
//Defines all the constants which can be used   

var InteractionEventTypes = {
  'InteractionEventTypeGesture': 0,
  'InteractionEventTypeSpeech': 1,
  'InteractionEventTypeCursor': 2
};

// **Gesture Types**  
// Used to determine what type of gesture was sent from the Kinesis Server
//    
//    1.   Swipe 
//        *   To detect swipes with any joint in any direction    
//    2.   Body    
//        *   Tells the direction and if it was a TypeLean (lean left, lean front etc) or a turn (turn left, turn right)    
//    3.   Hold    
//        *   Direction and joint. Essentially only a few joints and be held out. Like wrist, etc.    
//    4.   JointIntersection   
//        *   Allows the 3rd party developer to select joints which when touch each other trigger a function    
//    5.   SpeechGestureListener   
//        *   Command will be sent along with the control word. the control word needs to be set.   

var GestureTypes = {
  'GestureTypeSwipe': 0,
  'GestureTypeBody': 1,
  'GestureTypeHold': 2,
  'GestureTypeJointIntersection': 3,
  'GestureTypeSpeech' : 4
};

// **Gesture Directions**    
// Used to determine what direction the gesture happened. Not all directions are supported by all gestures.    
var GestureDirections = {
  'GestureDirectionLeft': 0,
  'GestureDirectionRight': 1,
  // *Jump incase of lean gesture*
  'GestureDirectionUp': 2, 
  'GestureDirectionDown': 3,     
  // *Crouch incase of lean gesture*
  'GestureDirectionFront': 4
};


// **JointTypes**
// The 20 joints whose data will be sent out from the Kinesis Server. The developer can pick which joint to bind a gesture to
var JointTypes = {
  'JointTypeHandRight': 0,
  'JointTypeWristRight': 1,
  'JointTypeElbowRight': 2,
  'JointTypeShoulderRight': 3,
  'JointTypeShoulderCenter': 4,
  'JointTypeShoulderLeft': 5,
  'JointTypeElbowLeft': 6,
  'JointTypeWristLeft': 7,
  'JointTypeHandLeft': 8,
  'JointTypeHead': 9,
  'JointTypeSpine': 10,
  'JointTypeHipCenter': 11,
  'JointTypeFootRight': 12,
  'JointTypeAnkelRight': 13,
  'JointTypeKneeRight': 14,
  'JointTypeFootRight': 15,
  'JointTypeHipRight': 16,
  'JointTypeHipLeft': 17,
  'JointTypeKneeLeft': 18,
  'JointTypeAnkleLeft': 19,
  'JointTypeFootLeft': 20
};


// CONSTANTS JS ENDS
  
// GESTURE LISTENER JS STARTS

//*Version 0.1*   
// Enabling Class Inheritance in Javascript   
Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
};

// **Gesture Listener Class**
// This class is used to define what all events should Kinesis JS SDK listen to in order to fire custom events    
// This acts as the base class of all gesture listener classes.   
// Developers can easily make instance variables, customize the gesture and then start listening to them
function GestureListener() {
	    
	GestureListener.poll = function(){
    if (InteractionModel != InteractionModelTypes.InteractionModelTypeKinect){
      return;
    }
  };
	
	GestureListener.mouseMove = function(position){
		if(Kinesis.cursor != null)
			Kinesis.cursor(position);
			
	  cursor = document.getElementById('cursor');
	  
	  cursor.style.left = position.x - 45 + "px";
	  cursor.style.top = position.y - 45 + "px";
    var _element = document.elementFromPoint(position.x, position.y);
    if (_element.className.search('interactive') != -1){
      var _currentElement = _element.parentNode;
      if ((Kinesis.lastElement.length == 0) || (Kinesis.lastElement[0] != _currentElement)){
        if (Kinesis.lastElement.length != 0){
          Kinesis.lastElement[0].className = Kinesis.lastElement[0].className.replace( /(?:^|\s)active(?!\S)/ , '' );
          cursor.deactivateCursorTimer();
        }
        if (_currentElement.className.search('active') == -1)
          _currentElement.className += " active";      
        activateCursorTimer(cursor);
        Kinesis.lastElement.push(_currentElement);

        if (Kinesis.clickEventTimer){          
          clearTimeout(Kinesis.clickEventTimer);
        };

        Kinesis.clickEventTimer = setTimeout(function(){
          _currentElement.className = _currentElement.className.replace( /(?:^|\s)active(?!\S)/ , '' );
          deactivateCursorTimer(cursor);
          $(_currentElement).trigger('click');
          setTimeout(function() {
            Kinesis.lastElement.pop(_currentElement);
          }, Kinesis.holdEventDelay );
        }, 2000);
      }
    }
    else {
      if (Kinesis.clickEventTimer){
        Kinesis.lastElement.pop(_currentElement);
        clearTimeout(Kinesis.clickEventTimer);
        deactivateCursorTimer(cursor);
      }
    }
    
  };
};

//
function SwipeGestureListener() {
	SwipeGestureListener.prototype.gestureType  = GestureTypes.GestureTypeSwipe,
	SwipeGestureListener.prototype.joints       = [JointTypes.JointTypeHandRight, JointTypes.JointTypeHandLeft],
	SwipeGestureListener.prototype.directions   = [GestureDirections.GestureDirectionLeft, GestureDirections.GestureDirectionRight, GestureDirections.GestureDirectionUp, GestureDirections.GestureDirectionDown];
  SwipeGestureListener.prototype.eventDelay   = 500;
  SwipeGestureListener.prototype.accuracy     = null;
  SwipeGestureListener.prototype.bounds       = {min: null, max: null};
  SwipeGestureListener.prototype.toFire       = null;
};

SwipeGestureListener.inheritsFrom(GestureListener);

function HoldGestureListener() {
	HoldGestureListener.prototype.gestureType  = GestureTypes.GestureTypeHold,
	HoldGestureListener.prototype.joints       = [JointTypes.JointTypeHandRight, JointTypes.JointTypeHandLeft],
	HoldGestureListener.prototype.directions   = [GestureDirections.GestureDirectionLeft, GestureDirections.GestureDirectionRight, GestureDirections.GestureDirectionUp, GestureDirections.GestureDirectionDown];
  HoldGestureListener.prototype.eventDelay   = 500;
  HoldGestureListener.prototype.accuracy     = null;
  HoldGestureListener.prototype.bounds       = {min: null, max: null};
  HoldGestureListener.prototype.toFire       = null;
  HoldGestureListener.prototype.selector     = null;
};

HoldGestureListener.inheritsFrom(GestureListener);

// GESTURE LISTENER JS ENDS

// KINESIS JS STARTS

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

	// This is called whenever a new instance of the class is created     
	// *Parameter is the parsed JSON String which comes from the Kinect Class*    
  this.initialize = function(data) {
    if( Kinesis.gestureDetection == true && data )
      this.matchGestures(data);
  };
  
  Kinesis.onStatusChange = function(message) {
    console.info(message);
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
  var _cursor       = document.createElement('div');
  _cursor.id        = 'cursor';
  _cursor.innerHTML = '&nbsp;';
  document.body.appendChild(_cursor);
};

var originalInit = window.onload;

// Initialize the Layout and Kinect Classes
function init() {
  setTimeout(function(){
    insertCursor();
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

// KINESIS JS ENDS

// KINECT JS STARTS

// *Version 0.1*    
//    
// Kinect.js is the class responsible for connecting to the Kinesis Windows service which interacts directly with the Kinect
var Kinect = function() {
  //
  Kinect.prototype.init = function(){
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
    
    // Only if the browser being used does not support WebSockets
    if (support == null) {
        alert("Your browser cannot support WebSockets!");
        return;
    }

    // Create a new websocket and connect
    var ws = new window[support]('ws://127.0.0.1:2011/');

    // Called only when any data comes from 
    ws.onmessage = function (evt) {
      try {
        var _data = JSON.parse(evt.data);
        if(_data.Kinect != undefined) {
          if(_data.Kinect == "Connected")
            Kinesis.kinectStatus = true;
          else
            Kinesis.kinectStatus = false;
          Kinesis.onStatusChange(_data.Kinect);
        };
        
        if (_data.cursor != undefined) {
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
      log("Connection Opened");
    };

    // After the connection is closed, the method is called
    ws.onclose = function () {
      log("Connection Closed");
    }
  }
};

// Window Onload event to initialize everything. This method is defined in the Kinesis.js file.
window.onload = init;

// KINECT JS ENDS