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
function twitterCallback2(twitters) {
  var statusHTML = [];
  for (var i=0; i<twitters.length; i++){
    var username = twitters[i].user.screen_name;
    var uname    = twitters[i].user.name;
    var imageurl = twitters[i].user.profile_image_url;
    var location = location;
    var entities = twitters[i].entities;
    var pic = "";
    if (entities.media != undefined)
      var pic = entities.media[0].media_url;
    var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
      return '<a href="'+url+'">'+url+'</a>';
    }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
      return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
    });
    statusHTML.push('<div class="tileItem tweetBlock">'+ '<div class="intro"><img src="'+imageurl+'"/><span class="name">' + uname + '</span><span class="sname">@' + username + '</span></div><div class="tweet"><span>' + status+'</span> <a class="time" href="http://twitter.com/'+username+'/statuses/'+twitters[i].id_str+'">'+relative_time(twitters[i].created_at)+'</a></div>');
    if (pic)
      statusHTML.push('<a href="' + pic + '"' + 'class="pic"><img class="interactive" src="'+pic+'"/>' + '</a></div>');
    else
      statusHTML.push('</div>');
  }
  var lhtml = document.getElementById('gridHolder').innerHTML;
  document.getElementById('gridHolder').innerHTML = lhtml + statusHTML.join('');
  document.getElementById('spinner').style.display = 'none';
}

function relative_time(time_value) {
  var values = time_value.split(" ");
  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
  delta = delta + (relative_to.getTimezoneOffset() * 60);

  if (delta < 60) {
    return 'less than a minute ago';
  } else if(delta < 120) {
    return 'about a minute ago';
  } else if(delta < (60*60)) {
    return (parseInt(delta / 60)).toString() + ' minutes ago';
  } else if(delta < (120*60)) {
    return 'about an hour ago';
  } else if(delta < (24*60*60)) {
    return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
  } else if(delta < (48*60*60)) {
    return '1 day ago';
  } else {
    return (parseInt(delta / 86400)).toString() + ' days ago';
  }
}

// twitter information setup
twhandle    = 'blue angels';
twcount     = 10;
api_url     = 'https://api.twitter.com/1/statuses/user_timeline.json';
callback    = 'twitterCallback2'
entities    = 'true'

request_url = api_url + '?callback=' + callback +'&include_entities=' + entities + '&screen_name=' + twhandle + '&count=' + twcount;

document.write('<script type="text\/javascript" src=');
document.write(request_url);
document.write('><\/script>');