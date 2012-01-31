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

function GestureListener() {
	    
	GestureListener.poll = function(){
    if (InteractionModel != InteractionModelTypes.InteractionModelTypeKinect){
      return;
    }
  };
	
	GestureListener.mouseMove = function(position){
	  cursor = document.getElementById('cursor');
	  cursor.style.left = position.x - 45 + "px";
	  cursor.style.top = position.y - 45 + "px";
    var _element = document.elementFromPoint(position.x, position.y);
    if (_element.className.search('interactive') != -1){
      var _currentElement = _element;
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
        }
        Kinesis.clickEventTimer = setTimeout(function(){
          _currentElement.className = _currentElement.className.replace( /(?:^|\s)active(?!\S)/ , '' );
          deactivateCursorTimer(cursor);
          setTimeout(function() {
            _currentElement.onclick();
          }, 10 );
          setTimeout(function() {
            Kinesis.lastElement.pop(_currentElement);
          }, Kinesis.holdEventDelay );
        }, 2000);
      }
    }
  };
};

function SwipeGestureListener() {
	SwipeGestureListener.prototype.gestureType  = GestureTypes.GestureTypeSwipe,
	SwipeGestureListener.prototype.joints       = [JointTypes.JointTypeHandRight, JointTypes.JointTypeHandLeft],
	SwipeGestureListener.prototype.directions   = [GestureDirections.GestureDirectionLeft, GestureDirections.GestureDirectionRight, GestureDirections.GestureDirectionUp, GestureDirections.GestureDirectionDown];
  SwipeGestureListener.prototype.eventDelay   = 500;
  SwipeGestureListener.prototype.pollInterval = 200;
  SwipeGestureListener.prototype.accuracy     = null;
  SwipeGestureListener.prototype.bounds       = null;
  SwipeGestureListener.prototype.toFire       = null;
};

SwipeGestureListener.inheritsFrom(GestureListener);

function HoldGestureListener() {
	HoldGestureListener.prototype.gestureType  = GestureTypes.GestureTypeHold,
	HoldGestureListener.prototype.joints       = [JointTypes.JointTypeHandRight, JointTypes.JointTypeHandLeft],
	HoldGestureListener.prototype.directions   = [GestureDirections.GestureDirectionLeft, GestureDirections.GestureDirectionRight, GestureDirections.GestureDirectionUp, GestureDirections.GestureDirectionDown];
  HoldGestureListener.prototype.eventDelay   = 500;
  HoldGestureListener.prototype.pollInterval = 200;
  HoldGestureListener.prototype.accuracy     = null;
  HoldGestureListener.prototype.bounds       = null;
  HoldGestureListener.prototype.toFire       = null;
  HoldGestureListener.prototype.selector     = null;
};

HoldGestureListener.inheritsFrom(GestureListener);