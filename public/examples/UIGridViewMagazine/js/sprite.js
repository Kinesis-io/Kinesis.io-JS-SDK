var canvas, ctx, sprites,
    width = 500,
    height = 400,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    ship_x = (width / 2) - 25, ship_y = height - 85, ship_w = 65, ship_h = 85,
    srcX = 10, srcY = 0;

function clearCanvas() {
  ctx.clearRect(0,0,500,400);
}
function drawShip() {
  if (rightKey) {
    ship_x += 5;
    srcX = 83;
  } else if (leftKey) {
    ship_x -= 5;
    srcX = 156;
  }
  ctx.drawImage(sprites,srcX,srcY,ship_w,ship_h,ship_x,ship_y,ship_w,ship_h);
  if (rightKey == false || leftKey == false) {
    srcX = 10;
  }
}
function loop() {
  clearCanvas();
  drawShip();
}
function keyDown(e) {
  if (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey = true;
}
function keyUp(e) {
  if (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey = false;
}
(function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  sprites = new Image();
  sprites.src = 'images/ships2.png';
  setInterval(loop, 1000/30);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
})();
//init();