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
    Layout.init();
    Kinect.init();
  }, 10);
};

window.onload = init;