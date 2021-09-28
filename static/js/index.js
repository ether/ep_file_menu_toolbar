'use strict';

exports.documentReady = () => {
  /* eslint-disable-next-line max-len */
  $.getScript('../static/plugins/ep_aa_file_menu_toolbar/static/js/lib/jquery-css-dropdown-plugin-master/dropdown-menu.js', () => {
    $(() => {
      $('.dropdown-menu').dropdown_menu({
        open_delay: 50, // Delay on menu open
        close_delay: 300, // Delay on menu close
      });
    });
  });
  $('#newPad').attr('href', `./${randomPadName()}`);

  const exports = $('#exportColumn').children('a');
  $.each(exports, (k, v) => {
    const href = $(v).attr('href');
    const txt = $(v).text();
    const html = `<a class='exportlink' href='${href}'><div class='exportttype'>${txt}</div></a>`;
    $('#file_menu_exports > .submenu').append(html);
  });
  $('#importexportlink').click(() => {
    $('#importfileinput').click();
    $('#import_export').addClass('popup-show');
  });

  $('#filemenutoolbarsettings').click(() => {
    $('#settings').addClass('popup-show');
  });

  $('#filemenutoolbarembed').click(() => {
    $('#embed').addClass('popup-show');
  });

  $('body').on('click', ".dropdown-menu-sub-indicator *[data-key='undo']", () => {
    $('#editbar').find("*[data-key='undo']").click();
  });

  $('body').on('click', ".dropdown-menu-sub-indicator *[data-key='redo']", () => {
    $('#editbar').find("*[data-key='red']").click();
  });
};

/* eslint-disable-next-line no-unused-vars */
const printPad = () => {
  const pad = $('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]')[0];
  pad.contentWindow.print();
};

const randomPadName = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const string_length = 10;
  let randomstring = '';
  for (let i = 0; i < string_length; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
};
