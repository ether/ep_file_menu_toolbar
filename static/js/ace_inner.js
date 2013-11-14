// This is a hack to get around ACEs brain-dead limit on onClick on
// links inside the ACE domlines...
// Borrowed from: https://github.com/redhog/ep_sketchspace/blob/master/static/js/ace_inner.js

/*
$(document).bind("keyup", function(e) {
  if(!parent.parent.pad.myUserInfo.name){
    clearTimeout(timer);
    var timer = setTimeout(function(){
      if ( !parent.parent.$('#users').is(':visible') ) parent.parent.$('#usericon').click();
    },5000);
  }
});

*/
