$.mobile.defaultPageTransition = "win8Flip";

var InteractionModelTypes = {
  'InteractionModelTypeTablet': 0,
  'InteractionModelTypeKinect': 1,
  'InteractionModelTypeCursor': 2,
  'InteractionModelTypeOthers': 3,
};

var InteractionModel = InteractionModelTypes.InteractionModelTypeCursor;

var _lastInteractiveElement = [];

var _spinner = new Image();
