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