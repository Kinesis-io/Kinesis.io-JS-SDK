var timer;
var Interactions = {  
  init : function(){
    Interactions.loadCommon();

    switch(InteractionModel) {
      case InteractionModelTypes.InteractionModelTypeKinect:
        Interactions.loadKinect();
        break;
      case InteractionModelTypes.InteractionModelTypeTablet:
        Interactions.loadTablet();
        break;
      case InteractionModelTypes.InteractionModelTypeCursor:
        Interactions.loadCursor();
        break;
    }
  },
  loadCommon : function(){
    $("#content").mousemove(function(event){
      InteractionModel = InteractionModelTypes.InteractionModelTypeCursor;
      GestureListener.mouseMove({x : event.screenX, y : event.screenY})
    });
  },
  loadKinect : function(){

  },
  loadTablet : function(){

  },
  loadCursor : function(){

  }
}


var Layout = {
  pageSize : null,

  reload : function(){
    var _page       = $("#content");
    Layout.pageSize = { width: _page.width(), height: _page.height() };
  },
  init : function(){
    Layout.reload();
  }
}

function init() {
  setTimeout(function(){
    Interactions.init();
    Layout.init();
    Kinect.init();
  }, 10);
};

window.onload = init;