exports.documentReady = function(){
  $.getScript("/static/plugins/ep_file_menu_toolbar/static/js/lib/jquery-css-dropdown-plugin-master/dropdown-menu.min.js", function(){
    $('.dropdown-menu').dropdown_menu();
  });
}
