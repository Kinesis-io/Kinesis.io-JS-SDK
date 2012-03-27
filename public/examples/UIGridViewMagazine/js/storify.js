var kinesis = new Kinesis; // initialize kinesis

// start adding gestures from here //

// create swipe left gesture
var leftGesture         = new SwipeGestureListener("myswipeLeft");
// call to action for swipe left
leftGesture.toFire      = slideLeft;
// area within which the swipe left will be recognized; values in percentage(%)
leftGesture.bounds      = {min: {x: 50, y: 0, z: 0}};
// allowed joints for gesture
leftGesture.joints      = [JointTypes.JointTypeHandRight]; // right hand
// allowed direction for gesture
leftGesture.directions  = [GestureDirections.GestureDirectionLeft]; // left

// create swipe right gesture
var rightGesture        = new SwipeGestureListener("myswipeRight");
// call to action for swipe left
rightGesture.toFire     = slideRight;
// area within which the swipe left will be recognized; values in percentage(%)
rightGesture.joints     = [JointTypes.JointTypeHandLeft];
// allowed joints for gesture
rightGesture.bounds     = {max: {x: 50, y: 100, z: 100}};
// allowed direction for gesture
rightGesture.directions = [GestureDirections.GestureDirectionRight];

kinesis.addGesture(leftGesture);  // insert leftGesture to kinesis
kinesis.addGesture(rightGesture); // insert rightGesture to kinesis

function storifyCallback2Magazine(data) {
	var stories = [];
	$.each(data.content.stories, function(index, story) {
		stories.push({
										caption: "", 
										content: createContentForMagazine(story)
								 });
	});
	$('#kui-grid-view').gridfy({
		content_json: stories,
		sizeOfGrid: {height: '590px', width: '550px'},
	});
};

function createContentForMagazine(story) {
	html = "";
	
	// add user avatar
	html += "<dl class='publisherInfo'><dt class='avatar'><img src='" + story.author.avatar + "' /></dt>";
	// add user name
	html += "<dd class='username'><span>Storified By </span>" + story.author.username + "</dd>";
	// add number of views
	html += "<dd class='views'>" + story.stats.views + " views </dd></dl>";
	
	// add title
	html += "<div class='title'>" + story.title + "</div>";
	
	// add description
	if (story.description != null)
		html += "<div class='detail'>" + story.description + "</div>";
	
	// add story thumbnail
	if (story.thumbnail != "http://storify.com/public/img/default-thumb.gif")
		html += "<div class='thumb'><img src='" + story.thumbnail + "' /></div>";
	else {
		var allUsers = story.meta.quoted;
		var images = [];
		$.each(allUsers, function(i) {
			if (allUsers[i].avatar != undefined)
				images.push(allUsers[i].avatar);
		});
		html += "<div class='imageHolder'>"
		$.each(images, function(i) {
			html += "<img src='" + images[i] + "' />" 
		});
		html += "</div>"
	}
		
	
	return html;
};

function storifyCallback2Show(data) {
	var html = "<div class='story'>";
	var counter = 0;
	$.each(data.content.elements, function(index, element) {
		if (counter <= 6) {
			// add user avatar
			html += "<div class='element'>";
	
			var data = element.data;
			if (data.text) {
				html += "<div class='quote'>" + data.text + "</div>";
				counter++;
			}
			else if (data.quote) {
				html += "<div class='quote'>"
					html += "<div class='usertext'>" + data.quote.text + "</div>";
					html += "<div class='info'>"
						html += "<div class='source " + element.source.name + "'><span>" + element.posted_at + "</span></div>";
						html += "<div class='username'><span>" + data.quote.username + "</span><img class='avatar' src='" + element.attribution.thumbnail + "' />" + "</div>";
					html += "</div>";
				html += "</div>";
			}
			else if (data.image) {
				html += "<div class='imageHolder'><img class='image' src='" + data.image.src + "' /><div class='caption'>" + data.image.caption + "</div></div>";
				counter++;
			}
			html += "</div>";
		}
	});
	html += "</div>";
	
	$("#kui-grid-view").html(html);
	contentLoaded = true;
};

function slideLeft() {
  console.info("left");
  $("#kui-grid-view").turn('next');
};

function slideRight() {
  console.info("right");
  $("#kui-grid-view").turn('previous');
};

function turnToMagazine() {
	if (tilesLoaded) {
		$('#kui-grid-view').turn({shadows: true});
	  $('#kui-grid-view').bind('end', function(e) {
	    var currentView = $('#kui-grid-view').turn('view');
	    if(currentView[0] == 0)
	      $('#controller').animate({"left":"-150px"}, 1000);
	    else {
	      if(currentView[1] == 0)
	        $('#controller').animate({"left":"450px"}, 1000);
	      else
	        $('#controller').animate({"left":"150px"}, 1000);
	    } 
	  });
		tilesLoaded = false;
		clearInterval(turnInterval);
	}	
};

function turnToFlowing() {
	if (contentLoaded) {
		$('#kui-grid-view').columnize({
			width : 600,
			height : 650
		});
		contentLoaded = false;
		clearInterval(turnInterval);
	}
};