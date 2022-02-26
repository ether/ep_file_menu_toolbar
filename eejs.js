'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_styles = (hookName, args, cb) => {
  const css = eejs.require(
      'ep_aa_file_menu_toolbar/static/js/lib/jquery-css-dropdown-plugin-master/dropdown-menu.css',
      {}, module,
  );
  args.content = `${args.content}
    <style type='text/css'>${css}</style>`;
  cb();
};

exports.eejsBlock_body = (hookName, args, cb) => {
  args.content = eejs.require('ep_aa_file_menu_toolbar/templates/toolbar.ejs', {
    settings: false,
  }) + args.content;
  cb();
};
