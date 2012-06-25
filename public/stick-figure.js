$(document).ready(function(){
	var canvas;
	var canvasWidth;
	var canvasHeight;
	var ctx;
	var ptclArr = [];
	var ptclArr2 = [];
	
	canvas = document.getElementById('myCanvas');
	canvasWidth = 1000;
	canvasHeight = 600;
	ctx = canvas.getContext('2d');
	
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	
	
	var Particle = function(x, y){
		this.x = x;
		this.y = y;
		this.r = 5;

		this.color = 'hsl(' + Math.floor(Math.random() * 360) + ',100%, 50%)';

		this.update = function(newX, newY){
      this.x = newX;
      this.y = newY;
		};
		
		this.draw = function(){
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();
		};
	};

	function addPtcls(nmbr, x, y){
		for(var i = 0; i < nmbr; i++){
			var p = new Particle(x, y);
			ptclArr.push(p);
			p.draw();
		};
	};
	
	function addPtcls2(nmbr, x, y){
		for(var i = 0; i < nmbr; i++){
			var p = new Particle(x, y);
			ptclArr2.push(p);
			p.draw();
		};
	};
	
	addPtcls(20, 30, 30);
	addPtcls2(20, 30, 30);
	
	var redrawFigure = function (jointData){
    
    if (jointData === undefined )
      return;
    
   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
   for(var i = 0; i < ptclArr.length; i++) {
     var thisJointData = jointData[0][i];
     ptclArr[i].update(thisJointData[0]*5, thisJointData[1]*5);
   }
   for(var i = 0; i < ptclArr.length; i++) ptclArr[i].draw();
   
   if (jointData[1] === undefined )
     return;
   for(var i = 0; i < ptclArr2.length; i++) {
     var thisJointData = jointData[1][i];
     ptclArr2[i].update(thisJointData[0]*5, thisJointData[1]*5);
   }
   for(var i = 0; i < ptclArr2.length; i++) ptclArr2[i].draw();
  };
  
  window.redrawFigure = redrawFigure;
	
});