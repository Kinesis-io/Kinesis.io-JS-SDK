//returns back the base64 string for the screenshot in a callback
function screenshot(callback) {
	var date = new Date(),
    timer = date.getTime();
    options = {};
    options.elements = document.getElementsByTagName("body");
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
    html2canvas.Preload(document.body,  options);
}

function uploadScreenShot() {
	screenshot( function(data) {
	$.ajax({
		type: 'POST',
		url: '/upload',
		data: {obj:data},
		success: function(success) {
			console.info(success);
		}
	});
 	//newWindow=window.open(data, 'newDocument');
	});
}