function storifyCallback2Index(data) {
	var stories = [];
	$.each(data.content.stories, function(index, story) {
		stories.push(
									{caption: "<div class='caption-overlay'></div><div class='caption-text'>" + story.title + "</div>", content: "<img src='" + story.thumbnail + "' /><div class='pattern'></div>"}
								);
	});
	$('#kui-grid-view').gridfy({
		content_json: stories,
		sizeOfGrid: {height: '120px', width: '340px'}
	});
};