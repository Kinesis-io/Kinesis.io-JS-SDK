//returns back the base64 string for the screenshot in a callback
function screenshot(htmlobj, callback) {
	var date = new Date(),
    timer = date.getTime();
    options = {};
    options.elements = [htmlobj];
    html2canvas.logging = false;

    options.complete = function(images){
        var queue = html2canvas.Parse(this[0], images, options),
        $canvas = $(html2canvas.Renderer(queue, options)),
        finishTime = new Date();
		if(callback != undefined && callback.call)
			callback($canvas[0].toDataURL());
		else
			console.info("Callback not Specified");
    };
    html2canvas.Preload(htmlobj,  options);
}

function uploadScreenShot(htmlobj) {
	screenshot(htmlobj, function(data) {
	$.ajax({
		type: 'POST',
		url: '/upload',
		data: {obj:data},
		success: function(success) {
			var _flashDiv     = document.createElement('div');
  			_flashDiv.id      = 'flashDiv';
  			_flashDiv.setAttribute('style', 'opacity: 0; background-color: #ffffff; width:' + $(htmlobj).width() + 'px; height: ' + $(htmlobj).height() + 'px; z-index: 500; position: absolute');
  			htmlobj.appendChild(_flashDiv);

			$(_flashDiv).animate({ "opacity" : "1" }, 200, function() {
				$(_flashDiv).animate({"opacity" : "0"}, 200, function() {
					$(_flashDiv).remove();
				});
			});
		}
	});
 	//newWindow=window.open(data, 'newDocument');
	});
}