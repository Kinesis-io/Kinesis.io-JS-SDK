/**
  @license html2canvas v0.33 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */
/*
 * jQuery helper plugin for examples and tests
 */
(function( $ ){
    $.fn.html2canvas = function(options) {
        if (options && options.profile && window.console && window.console.profile) {
            console.profile();
        }
        var date = new Date(),
        $message = null,
        timeoutTimer = false,
        timer = date.getTime();
        options = options || {};
        options.elements = this;
        options.flashcanvas = "../external/flashcanvas.min.js";
        
        html2canvas.logging = options && options.logging;
		
        options.complete = function(images){
            var queue = html2canvas.Parse(this[0], images, options),
            $canvas = $(html2canvas.Renderer(queue, options)),
            finishTime = new Date();

			//console.info($canvas[0].toDataURL())
        };

		//console.info(this[0]);

        html2canvas.Preload(document.body,  options);
    };
})( jQuery );

