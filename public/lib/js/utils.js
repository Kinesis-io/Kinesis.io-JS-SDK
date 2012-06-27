addMessageBar = function() {
  var msgNode   = document.createElement("div");
  msgNode.setAttribute('id', 'kmessage');
  msgNode.setAttribute('class', 'message');
  document.body.appendChild(msgNode);
  msgNode.style.display = "none";
};

updateMessageBar = function(msg, isDisplayed) {
  // var messageBar = document.getElementById('kmessage');
  // if(isDisplayed) {
  //   messageBar.innerHTML = msg;
  //   var closeNode = document.createElement('span');
  //   closeNode.innerHTML  = "close";
  //   closeNode.setAttribute('onclick', "document.body.removeChild(document.getElementById('kmessage'));");
  //   closeNode.setAttribute('class', 'closeBtn');
  //   messageBar.appendChild(closeNode);
  //   messageBar.style.display = "block";
  // }
  // else
  //   messageBar.style.display = "none";
};