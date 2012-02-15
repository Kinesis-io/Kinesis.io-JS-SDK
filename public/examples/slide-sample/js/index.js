$.fn.activate = function() {
  var me = $(this);
  if(me)
    setTimeout(function() {
	    me.addClass('active');
	  }, 200 );
};

$.fn.slideLeft = function() {
  var tiles = $(this);
  var _index = tiles.find('.tile').index(tiles.find('.active')[0]);
  var _left = tiles.find('.tile').width() * (_index + 1);
  if(_index < tiles.find('.tile').length - 1) {
    $(this).css("-webkit-transform", "translate(-" + _left + "px, 0)");
    $(this).css("-moz-transform", "translate(-" + _left + "px, 0)");
    setTimeout(function() {
	    tiles.find('.active').removeClass('active').next().activate();
	  }, 200 );
  };
};

$.fn.slideRight = function() {
  var tiles = $(this);
  var _index = tiles.find('.tile').index(tiles.find('.active')[0]);
  var _left = tiles.find('.tile').width() * (_index - 1);
  if(_index > 0) {
    $(this).css("-webkit-transform", "translate(-" + _left + "px, 0)");
    $(this).css("-moz-transform", "translate(-" + _left + "px, 0)");
    setTimeout(function() {
	    tiles.find('.active').removeClass('active').prev().activate();
	  }, 200 );
  };
};