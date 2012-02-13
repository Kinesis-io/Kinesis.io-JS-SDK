var Speech = {
  recognizer  : "kinesis",
  timer       : null,
  listening   : false,
  
  init : function(){
    
  },
  recognize : function(text){
    if (text == Speech.recognizer){
      Speech.listening = true;
      
      if (Speech.timer){
        clearTimeout(Speech.timer);
      }

      Speech.timer = setTimeout(function(){
        Speech.listening = false;
      }, 4000);
    } else if (Speech.listening) {
      if (text == 'start playing') {
        // try to see if there is a video to play, play it
        $('.ui-page-active .content.trailer').click();
      } else if (text == 'stop playing') {
        // try to see if there is a video to play, stop it
        $('.ui-page-active .background video').click();
      }
    }
  }
}