// **Kinesis.js**   
// *Version 0.1*    
//    
// Kinesis.js is the base class which is managing all the added gestures and handling the events recieved from Kinect.js    
// Depends on the Kinect class
function Kinesis() {
  // Where all the gestures added will be stored
  Kinesis.gestures = [];
	Kinesis.lastElement = [];
	Kinesis.holdEventDelay = 4000;	
	Kinesis.clickEventTimer = null;
  Kinesis.prototype.keyword       = "KINESIS WINDOW ONE";
  // When multiple gestures can work in a predefined order
  Kinesis.prototype.is_series     = false;
  // When multiple gestures can work simultaneously to fire an event
  Kinesis.prototype.is_parallel   = true;
  Kinesis.prototype.streamCounter = 0;
  Kinesis.prototype.canvas        = "#kinesis";

	//This is called whenever a new instance of the class is created    
	//*Parameter is the parsed JSON String which comes from the Kinect Class*
	this.initialize = function(data) {
		if( data )
      this.matchGestures(data);
	};
	
	//Responsible for binding gestures to be matched when events are recieved from Kinect.js    
	//*Parameter is an object of the Gesture Class*
	Kinesis.prototype.addGesture	= function(gesture) {
	
	};

	Kinesis.prototype.setStream		= function() {
	
	};
	
	Kinesis.prototype.resetStream	= function() {
	
	};

	//Responsible for matching the recieved event from Kinect class with the already binded gestures    
	//*Parameter contains the parsed JSON event from the Kinect Class*
	Kinesis.prototype.matchGestures= function(data) {
	  if (data.gestures[0] != undefined) {
      eventType  = data.gestures[0].type;
      joints     = data.gestures[0].joints;
      direction  = [data.gestures[0].direction];
      accuracy   = data.gestures[0].accuracy;
    }
    
    if (data.cursor != undefined) {
      positionX = data.cursor.x;
      positionY = data.cursor.y;
      positionZ = data.cursor.z; 
    }
    
    for(index in Kinesis.gestures) {
      gesture = Kinesis.gestures[index]; 
      
      //Gesture Matching conditions
  	  if ((gesture.bounds == null) || (gesture.bounds.x <= positionX && gesture.bounds.y <= positionY && gesture.bounds.z <= positionZ)) {
  	    console.info("in bounds");
  	    if (gesture.gestureType == eventType) {
  	      console.info("gesture found");
  	      if ((joints.intersect(gesture.joints)).length > 0) {
  	        console.info("allowable joint");
  	        if ((direction.intersect(gesture.directions)).length > 0) {
  	          console.info("allowable direction");
  	          gesture.toFire(gesture);
  	          break;
  	        }
  	        else {
  	          console.info("direction did not match");
  	          continue;
  	        }
  	      }
  	      else {
  	        console.info("joints did not match");
  	        continue;
  	      }
  	    }
  	    else {
  	      console.info("gesture type did not match");
  	      continue;
  	    }
  	  }
  	  else {
  	    console.info("out of bounds");
  	    continue;
  	  }
      //Gesture matching ends
    }
	};
}


//Compute the intersection of n arrays
//*Parameter is an Array of N Arrays being sent to it*   
//*Returns back a single array which is an intersection of all arrays*    
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


//Return a new array with duplicate values removed    
//*Parameter is an array from which the duplicates are to be removed*   
//*Returns a single array with duplicates removed*    
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

var cursorTimer = null;

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
    context.beginPath();
    context.arc(centerX, centerY, radius, startingAngle, incrementAngle, counterclockwise);
    context.lineWidth = 8;
    context.strokeStyle = 'E5F3F9';
    context.stroke();
    context.closePath();
  }, 50);

  return me;
}

function deactivateCursorTimer(me){
  if(cursorTimer){
    clearInterval(cursorTimer);
  }
  var canvas = me;
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, 100, 100);

  return me;
}  
  
//*Layout Class*    
//Responsible for setting the layout of the page correctly. This can easily be overridden to incorporate the views
function Layout() {
  Layout.pageSize = { width: window.innerWidth, height: window.innerHeight };
};

//Initialize the Layout and Kinect Classes
function init() {
  setTimeout(function(){
    myLayout = new Layout();
    kinect = Kinect();
    Kinect.prototype.init();
  }, 10);
};