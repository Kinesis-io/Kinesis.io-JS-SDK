/*!
  * kinesis.io Custom JavaScript - TweetShow
  * http://kinesis.io/
  *
  * Copyright 2012, Kinesis.io
  * http://kinesis.io/license
  *
  * Copyright 2012, NotionQ LLP
  *
  * Date: Thu Feb 23 15:53:00 2012 +0530
*/

// twitter callback; iterates over fetched tweets and creates tweet elements dynamically and injects them as tile-items in the grid holder.
function storifyCallback2(data) {
	statusHTML = []
	story_data = data.content;
	// fetch story information
	story = {
						title: story_data.title,
						description: story_data.description
					};
	statusHTML.push('<div class="story">' + '<div class="title">' + story.title + '</div><div class="description">' + story.description + '</div></div>' );
	var oldHtml = document.getElementById('magazine').innerHTML;
  document.getElementById('magazine').innerHTML   = oldHtml + statusHTML.join('');
}

// create twitter api url
request_url = "http://api.storify.com/v1/stories/kobyakov888/my-life" + '?callback=' + 'storifyCallback2';

// insert request to twitter api for fetching tweets
document.write('<script type="text\/javascript" src=');
document.write(request_url);
document.write('><\/script>');