function Kinesis() {
	
	Kinesis.gestures = [];
	Kinesis.lastElement = [];
	Kinesis.holdEventDelay = 4000;	
	Kinesis.clickEventTimer = null;	  
  Kinesis.prototype.keyword       = "KINESIS WINDOW ONE";
  Kinesis.prototype.is_multiple   = false;
  Kinesis.prototype.is_parallel   = true;
  Kinesis.prototype.streamCounter = 0;
  Kinesis.prototype.canvas        = "#kinesis";
  
	this.initialize = function(data) {
		if( data )
      this.matchGestures(data);
	};
	
	Kinesis.prototype.addGesture	= function(gesture) {
	
	};
	
	Kinesis.prototype.setStream		= function() {
	
	};
	
	Kinesis.prototype.resetStream	= function() {
	
	};
	
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
      
      //matching begins
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
  	  //matching ends
    }
	};
}

// Compute the intersection of n arrays
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

// Return new array with duplicate values removed
Array.prototype.unique =
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
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
  
function Layout() {
  Layout.pageSize = { width: window.innerWidth, height: window.innerHeight };
};

function init() {
  setTimeout(function(){
    myLayout = new Layout();
    kinect = Kinect();
    Kinect.prototype.init();
  }, 10);
};