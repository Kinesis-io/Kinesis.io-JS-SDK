function Banner() {
	
	var keyword 	= "HONEY",
		canvas, context,	
		bgCanvas, bgContext,
		density 	= 13,
		particles 	= [],
		colours 	= ['#fff0a4', '#ffe98f', '#ffcf52', '#fbad1d', '#c48d1c'],
		mouse 		= { x:0, y:0 },
		isDrawing 	= false,
		canvasW, canvasH,
		defaultFont	= 'Arial';
	
	this.initialize 	= function( canvas_id, font ) {
		
		if( font )
			defaultFont = font;
		
		reload( canvas_id );
		
		window.onresize = function(event) {
			reload( canvas_id );
		}
		
	};
	
	var reload			= function( canvas_id ) {
	
		canvas 			= document.getElementById( canvas_id );

		context 		= canvas.getContext('2d');
		
		canvasW			= window.innerWidth;
		canvasH			= 300;
		
		canvas.width 	= canvasW;
		canvas.height 	= canvasH;
		
		bgCanvas 		= document.createElement('canvas');
		bgContext 		= bgCanvas.getContext('2d');
		
		bgCanvas.width 	= canvasW;
		bgCanvas.height = canvasH;
		
		canvas.addEventListener( 'kmousemove', MouseMove, false );
		canvas.addEventListener( 'kmouseout', MouseOut, false );
		
		prepare();
		setupParticles();
		draw();
	
	};
	
	var prepare 		= function() {
							
		//Chose the font, and size that we want.
		bgContext.font = "300px 'Jockey One'";
		
		//Fill the keyword text onto the canvas.
		bgContext.fillText(keyword, ( canvasW / 2 ) - ( Math.round( bgContext.measureText(keyword).width/2 ) ) , 260 );
		
	};
	
	var setupParticles 	= function() {
		
		particles = [];		
		
		//Declare our local variables
		var imageData, image_Data, 
			pixel,
			width	= 0,
			i		= 0,
			slide 	= false;
			
		//Get the image data - from (0,0) to the edges of the canvas
		imageData = bgContext.getImageData( 0, 0, canvasW, canvasH );
		image_Data= imageData.data;
		
		for( var height = 0; height < canvasH; height += density ) {
			
			++i;
	    	slide 	= ((i % 2) == 0);
			
			width	= 0;
			
			if (slide == true) {
			
	        	width += 6;
	        
			}
			
			//Iterate horizontally over the image data
			for( width; width < canvasW; width += density ) {
               
				//Get the pixel located at our current iteration
				pixel = image_Data[ ( ( width + ( height * canvasW )) * 4 ) - 1 ];
                  
				//Pixel has been drawn on.
				if( pixel == 255 ) {

					//Add the coodinates and colour to our particle array.
					particles.push({
						colour	: colours[ Math.floor( Math.random() * colours.length ) ],
						x		: width,
						y		: height
					});
					
				}
            }
        }    
	};
	
	var draw 			= function() {
			
		context.clearRect( 0, 0, canvasW, canvasH );
 		
 		var dx, dy, sqrDist,
			scale = 1;
 		
 		for ( var i = 0, len = particles.length; i < len ; ++i ) {
 			
			var p   	= particles[i];
			
			dx 			= p.x - mouse.x;
			dy 			= p.y - mouse.y;
			// distance from mouse to particle
			sqrDist 	= Math.sqrt( dx * dx + dy * dy );
			
			( isDrawing ) ? scale = Math.max( Math.min( 3 - ( sqrDist / 10 ), 10 ), 1 ) : scale = 1;
	
			var width  	= density / scale - 4,
				height 	= density,
				x 		= p.x,
				y 		= p.y;
			
			context.fillStyle = p.colour;
			
			context.beginPath();
			
			context.moveTo( x, y - height / 2 );
			context.lineTo( x + width / 2, y - height / 4 );
			context.lineTo( x + width / 2, y + height / 4 );
			context.lineTo( x, y + height / 2 );
			context.lineTo( x - width / 2, y + height / 4 );
			context.lineTo( x - width / 2, y - height / 4 );
			context.lineTo( x, y - height / 2 );  
			
			context.closePath();
			context.fill();
			
		}
		
	};
	
	var MouseMove 		= function( e ) {

		mouse.x = e.offsetX || ( e.screenX - canvas.offsetLeft );
   	mouse.y = e.offsetY || ( e.screenY - canvas.offsetTop );
		if( !isDrawing ) {
			
			isDrawing = true;
			drawTimeout = setTimeout( function() {
				draw();
				isDrawing = false;
			}, 2);
			
		}
		
	};
	
	var MouseOut 		= function(e) {
			
		isDrawing = false;	
		if (drawTimeout)
		  clearTimeout( drawTimeout );
		draw();
		
	};
	
}