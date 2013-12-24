exports.documentReady = function(){
  $.getScript("/static/plugins/ep_aa_file_menu_toolbar/static/js/lib/jquery-css-dropdown-plugin-master/dropdown-menu.js", function(){
    $(function() {
      $('.dropdown-menu').dropdown_menu({
        open_delay  : 50, // Delay on menu open
        close_delay : 300, // Delay on menu close
      });
    });
  });
  $('#newPad').attr("href", "/p/"+randomPadName());
}

function printPad(){

  window.print();

  // In chrome you have to fire the window.location.reload event to fire a print event.. More evidence Google = Microsoft
  // http://stackoverflow.com/questions/18622626/chrome-window-print-print-dialogue-opens-only-after-page-reload-javascript

  if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
    window.location.reload(); // Chrome is really broken here..
  }

}

function randomPadName(){
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var string_length = 10;
  var randomstring = '';
  for (var i = 0; i < string_length; i++){
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}
