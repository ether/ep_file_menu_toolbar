exports.documentReady = function(){
  $.getScript("../static/plugins/ep_aa_file_menu_toolbar/static/js/lib/jquery-css-dropdown-plugin-master/dropdown-menu.js", function(){
    $(function() {
      $('.dropdown-menu').dropdown_menu({
        open_delay  : 50, // Delay on menu open
        close_delay : 300, // Delay on menu close
      });
    });
  });
  $('#newPad').attr("href", "/p/"+randomPadName());

  var exports = $('#exportColumn').children("a");
  $.each(exports, function(k,v){
    var href = $(v).attr('href');
    var txt = $(v).text();
    var html = "<a class='exportlink' href='"+href+"'><div class='exportttype'>"+txt+"</div></a>";
    $('#file_menu_exports > .submenu').append(html);
  });
  $("#importexportlink").click(function(){
    $('#importfileinput').click();
    $('#import_export').addClass("popup-show");
  });

  $("#filemenutoolbarsettings").click(function(){
    $('#settings').addClass("popup-show");
  });

  $("#filemenutoolbarembed").click(function(){
    $('#embed').addClass("popup-show");
  });

  $("body").on("click", ".dropdown-menu-sub-indicator *[data-key='undo']", function(){
    $("#editbar").find("*[data-key='undo']").click();
  });

  $("body").on("click", ".dropdown-menu-sub-indicator *[data-key='redo']", function(){
    $("#editbar").find("*[data-key='red']").click();
  });
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
