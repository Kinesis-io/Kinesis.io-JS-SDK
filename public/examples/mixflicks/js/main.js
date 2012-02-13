$.fn.activate = function(){
  var me = $(this);
  me.addClass('active');

  me.parents('.tiles').prev().find('.active').removeClass('active');
  me.parents('.tiles').prev().find('#' + $(this).attr('data-name').replace(' ', '')).addClass('active');

  return me;
}

$.fn.slideLeft = function(){
  var tiles  = $(this);
  var _index = tiles.find('.tile').index(tiles.find('.tile.active')[0]);
  var _left  = tiles.find('.tile').width() * (_index + 1);

  tiles.addClass('slideIn');

  if (_index < tiles.find('.tile').length - 1) {
    tiles.css("-webkit-transform",
      "translate(-" + _left + "px, 0)"
    );
    tiles.css("-moz-transform",
      "translate(-" + _left + "px, 0)"
    );

    tiles.find('.tile.active').removeClass('active').next().activate();
  }

  setTimeout(function(){
    tiles.removeClass('slideIn');
  }, 1000);
}

$.fn.slideRight = function(){
  var tiles  = $(this);
  var _index = tiles.find('.tile').index(tiles.find('.tile.active')[0]);
  var _left  = tiles.find('.tile').width() * (_index - 1);

  tiles.addClass('slideOut');

  if (_index > 0) {
    tiles.css("-webkit-transform",
      "translate(-" + _left + "px, 0)"
    );
    tiles.css("-moz-transform",
      "translate(-" + _left + "px, 0)"
    );

    tiles.find('.tile.active').removeClass('active').prev().activate();
  }

  setTimeout(function(){
    tiles.removeClass('slideOut');
  }, 1000);
}


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
    $('#content').mousemove(function(event){
      InteractionModel = InteractionModelTypes.InteractionModelTypeCursor;
      Gestures.mouseMove({ x: event.pageX, y: event.pageY });
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
  tileSize : null,
  detailSize : null,

  reload : function(){
    var _page       = $('#content');
    Layout.pageSize = { width: _page.width(), height: _page.height() };

    var _padding    = Layout.pageSize.width - $('.grid .tiles .tile ul:first').width();
    var _tileWidth  = Layout.pageSize.width - _padding/3*2;
    Layout.tileSize = { width : _tileWidth, height : $('.grid .tiles .tile:first').height() };

    $('.grid .tiles .tile').css({ width: _tileWidth + 'px' });
    $('.grid .tiles').css({ 'padding-left': (Layout.pageSize.width - _tileWidth)/2 + 'px' });

    var _padding      = Layout.pageSize.width - $('.details .tiles .tile .content:first').width();
    var _tileWidth    = Layout.pageSize.width - _padding/3*2;
    Layout.detailSize = { width : _tileWidth, height : $('.details .tiles .tile:first').height() };

    $('.details .tiles .tile').css({ width: _tileWidth + 'px' });
    $('.details .tiles').css({ 'padding-left': (Layout.pageSize.width - _tileWidth)/2 + 'px' });
  },
  init : function(){
    Layout.reload();
    $('.tiles .tile:first-child').activate();

    $(window).resize(function() {
      //Layout.reload();
    });
  }
}

var cursorTimer = null;

$.fn.activateCursorTimer = function(){
  var me = $(this);
  var canvas = me[0];
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

$.fn.deactivateCursorTimer = function(){
  if(cursorTimer){
    clearInterval(cursorTimer);
  }

  var me = $(this);
  var canvas = me[0];
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, 100, 100);

  return me;
}


$(function() {
  $.each($('#content>div'), function(){
    var me      = $(this);
    var toolbar = me.find('.toolbar');
    $.each(me.find('.tile'), function(){
      toolbar.append('<li id="' + $(this).attr('data-name').replace(' ', '') + '">' + $(this).attr('data-name') + '</li>')
    });
  });

  setTimeout(function(){
    Interactions.init();
    Layout.init();
    Gestures.init();
    Kinect.init();
    Speech.init();
  }, 10);

  setTimeout(function(){
    //$('#content .ui-page-active .tiles').slideLeft();
  }, 100);

  $('.content.trailer').click(function(){
    $('.ui-page-active').addClass('playing');
    var video = $('.ui-page-active video')[0];
    video.currentTime = 0;
  });
  $('.background video').click(function(){
    $('.ui-page-active').removeClass('playing');
  });

  $('.ui-page-active.active').live('click', function(){
    $('.ui-page-active').removeClass('playing');
  });
  $('.ui-page-active #close').live('click', function(){
    $('.ui-page-active').removeClass('playing');
  });
});

$('[data-role=page]').live('pageshow', function(event){
  var _page = $( event.target );

  // stop all the videos
  $.each($('.background video'), function(){
    //this.pause();
  });

  // start the current video
  var _video = _page.find('.background video');
  if (_video.length > 0){
   // _video[0].play();
  }

  setTimeout(function(){
    var _position = _page.find('.active .content').offset();
    _page.find('.toolbar').css({ left: 100 + 'px', top: (_position.top - 100) + 'px', opacity: 1.0 });
  }, 1000);
});

$(document).bind("mobileinit", function(){
  $.mobile.touchOverflowEnabled = true;
});