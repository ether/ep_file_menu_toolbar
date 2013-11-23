exports.documentReady = function(){
  $.getScript("/static/plugins/ep_aa_file_menu_toolbar/static/js/lib/jquery-css-dropdown-plugin-master/dropdown-menu.js", function(){
    $(function() {
      $('.dropdown-menu').dropdown_menu({
        open_delay  : 50, // Delay on menu open
        close_delay : 300, // Delay on menu close
      });
    });
  });
}
