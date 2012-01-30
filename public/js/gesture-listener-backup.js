var GestureListener = {
  eventName          : 'onclick',
  selector           : '#canvas-banner', 
  joints             : [],
  direction          : null,
  accuracy           : null,
  allowableJoints    : [JointTypes.JointTypeHandRight, JointTypes.JointTypeHandLeft],
  allowableDirection : [GestureDirections.GestureDirectionLeft, GestureDirections.GestureDirectionRight],
  position           : {},
  eventType          : null,
  lastPosition       : {},
  pollInterval       : 200,
  scrollEventTimer   : null,
  clickEventTimer    : null,
  eventDelay         : 500,
  lastElement        : null,

  init : function(){

  },
  poll : function(){
    if (InteractionModel != InteractionModelTypes.InteractionModelTypeKinect){
      return;
    }
    if (GestureListener.eventType == GestureTypes.GestureTypeSwipe){
      if (GestureListener.direction == GestureDirections.GestureDirectionLeft && ($.inArray(0, GestureListener.joints) || $.inArray(8, GestureListener.joints))) {
        GestureListener.scrollEventTimer = setTimeout(GestureListener.scrollLeft, GestureListener.eventDelay);
      }
      if (GestureListener.direction == GestureDirections.GestureDirectionRight && ($.inArray(0, GestureListener.joints) || $.inArray(8, GestureListener.joints))) {
        GestureListener.scrollEventTimer = setTimeout(GestureListener.scrollRight, GestureListener.eventDelay);
      }
    }
  },
  scrollLeft : function(){
    console.info('scrollLeft');
  },
  scrollRight : function(){
    console.info('scrollRight');
  },
  scrollUp : function(){
    console.info('scrollUp');
  },
  scrollDown : function(){
    console.info('scrollDown');
  },
  mouseMove : function(position){
    $('#cursor').css({ left: position.x - 45, top: position.y - 45 });
  }
}