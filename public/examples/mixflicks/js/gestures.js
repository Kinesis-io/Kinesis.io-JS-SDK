var Gestures = {
  lastPosition      : {},
  pollInterval      : 200,
  threshold_h       : 400,
  threshold_v       : 300,
  scrollEventTimer  : null,
  clickEventTimer   : null,
  eventDelay        : 500,
  lastElement       : null,

  init : function(){
    setInterval(Gestures.poll, Gestures.pollInterval);
    Gestures.wheel();
  },
  wheel : function(){
    $('body').mousewheel(function(event, delta){
      if (delta > 0.666){
        clearTimeout(Gestures.scrollEventTimer);
        Gestures.scrollEventTimer = setTimeout(Gestures.scrollRight, Gestures.eventDelay);
      } else if (delta < -0.666){
        clearTimeout(Gestures.scrollEventTimer);
        Gestures.scrollEventTimer = setTimeout(Gestures.scrollLeft, Gestures.eventDelay);
      }
    });
  },
  poll : function(){
    if (InteractionModel != InteractionModelTypes.InteractionModelTypeKinect){
      return;
    }

    var _position = {
      left : parseInt($('#cursor').css('left')),
      top  : parseInt($('#cursor').css('top'))
    };

    var _difference = {
      left : Gestures.lastPosition.left - _position.left,
      top  : Gestures.lastPosition.top - _position.top
    }

    Gestures.lastPosition = _position;

    if (_difference.left > Gestures.threshold_h){
      clearTimeout(Gestures.scrollEventTimer);
      Gestures.scrollEventTimer = setTimeout(Gestures.scrollLeft, Gestures.eventDelay);
    }

    if (_difference.left < -Gestures.threshold_h){
      clearTimeout(Gestures.scrollEventTimer);
      Gestures.scrollEventTimer = setTimeout(Gestures.scrollRight, Gestures.eventDelay);
    }

    if (_difference.top > Gestures.threshold_v){
      clearTimeout(Gestures.scrollEventTimer);
      Gestures.scrollEventTimer = setTimeout(Gestures.scrollUp, Gestures.eventDelay);
    }

    if (_difference.top < -Gestures.threshold_v){
      clearTimeout(Gestures.scrollEventTimer);
      Gestures.scrollEventTimer = setTimeout(Gestures.scrollDown, Gestures.eventDelay);
    }
  },
  scrollUp : function(){
    console.info('scrollUp');
  },
  scrollDown : function(){
    console.info('scrollDown');
    if ($('.ui-page-active #close').css('display') == 'none'){
      $('.ui-page-active .back').click();
    } else {
      $('.ui-page-active #close').click();
    }
  },
  scrollLeft : function(){
    console.info('scrollLeft');
    $('#content .ui-page-active .tiles').slideLeft();

    if (Gestures.clickEventTimer){
      clearTimeout(Gestures.clickEventTimer);
      $("#cursor").deactivateCursorTimer();
    }
  },
  scrollRight : function(){
    console.info('scrollRight');
    $('#content .ui-page-active .tiles').slideRight();

    if (Gestures.clickEventTimer){
      clearTimeout(Gestures.clickEventTimer);
      $("#cursor").deactivateCursorTimer();
    }
  },
  mouseMove : function(position){
    $('#cursor').css({ left: position.x - 45, top: position.y - 45 });

    if (InteractionModel == InteractionModelTypes.InteractionModelTypeKinect){
      var _element = document.elementFromPoint(position.x, position.y);
      if (_element.className.search('interactive') != -1){
        var _currentElement = $(_element).parent();
        
        if (!Gestures.lastElement || Gestures.lastElement[0] != _currentElement[0]){
          if (Gestures.lastElement){
            Gestures.lastElement.removeClass('active');
            $("#cursor").deactivateCursorTimer();
          }

          _currentElement.addClass('active');
          $("#cursor").activateCursorTimer();
          Gestures.lastElement = _currentElement;

          if (Gestures.clickEventTimer){
            clearTimeout(Gestures.clickEventTimer);
          }
          Gestures.clickEventTimer = setTimeout(function(){
            _currentElement.click().removeClass('active');
            $("#cursor").deactivateCursorTimer();
          }, 2000);
        }
      } else {
        if (Gestures.clickEventTimer){
          clearTimeout(Gestures.clickEventTimer);
          $("#cursor").deactivateCursorTimer();
        }
      }
    }
  }
}