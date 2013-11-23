var eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_styles = function(hook_name, args, cb){
  args.content = args.content + "<style type='text/css'>"+eejs.require("ep_aa_file_menu_toolbar/static/js/lib/jquery-css-dropdown-plugin-master/dropdown-menu.css", {}, module) + "</style>";
  return cb();
}

exports.eejsBlock_body = function (hook_name, args, cb)
{
  args.content = eejs.require('ep_aa_file_menu_toolbar/templates/toolbar.ejs', {settings : false}) + args.content;
}


