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
