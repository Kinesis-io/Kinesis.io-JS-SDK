function currentYPosition() {
  // Firefox, Chrome, Opera, Safari
  if (self.pageYOffset) return self.pageYOffset;
  
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
      
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

function currentXPosition() {
  if (self.pageXOffset) return self.pageXOffset;
}

// smooth scrolling animation
function smoothScrollY(value) {
  var startY = currentYPosition();
  var stopY = startY + value
  
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY); return;
  }
  var speed = Math.round(distance / 100);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i=startY; i<stopY; i+=step) {
      setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
      leapY += step; if (leapY > stopY) leapY = stopY; timer++;
    } return;
  }
  for (var i=startY; i>stopY; i-=step) {
    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
    leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
  }
};

// smooth scrolling animation
function smoothScrollX(value) {
  var startX = currentXPosition();
  
  if (startX == undefined)
    startX = 0;
    
  var stopX = startX + value;
  
  var distance = stopX > startX ? stopX - startX : startX - stopX;
  if (distance < 100) {
    scrollTo(stopX, 0); return;
  }
  var speed = Math.round(distance / 100);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapX = stopX > startX ? startX + step : startX - step;
  var timer = 0;
  if (stopX > startX) {
    for (var i=startX; i<stopX; i+=step) {
      setTimeout("window.scrollTo(" + leapX + ", 0)", timer * speed);
      leapX += step; if (leapX > stopX) leapX = stopX; timer++;
    } return;
  }
  for (var i=startX; i>stopX; i-=step) {
    setTimeout("window.scrollTo(" + leapX + ", 0)", timer * speed);
    leapX -= step; if (leapX < stopX) leapX = stopX; timer++;
  }
};

// smooth scroll page up
function scrollUp(value) {
  smoothScrollY((value/3) * -1);
}

// smooth scroll page down
function scrollDown(value) {
  smoothScrollY(value/3);
}

// smooth scroll page left
function scrollLeft(value) {
  smoothScrollX((value/3) * -1);
}

// smooth scroll page right
function scrollRight(value) {
  smoothScrollX(value/3);
}

// scrolls the page up and down
// if cursor is at the top of page it scrolls down
// if cursor is at the bottom of page it scrolls up
// Layout is part of kinesis; it gives the pageSize (height and width of the window)
function movement(position) {
  if(position.y < Layout.pageSize.height * 0.2)
    scrollUp((Layout.pageSize.height * 0.2) - position.y);
  else if(position.y > Layout.pageSize.height * 0.8)
    scrollDown(position.y - (Layout.pageSize.height * 0.8));
  else if(position.x < Layout.pageSize.width * 0.2) 
    scrollLeft((Layout.pageSize.width * 0.2) - position.x);
  else if(position.x > Layout.pageSize.width * 0.8) 
    scrollRight(position.x - (Layout.pageSize.width * 0.8));
};