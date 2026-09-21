'use strict';

const assert = require('assert').strict;
const pluginDefs = require('ep_etherpad-lite/static/js/pluginfw/plugin_defs');

const BLOCKS = ['dd_format_text', 'dd_format_block', 'dd_format'];

// Render the toolbar with a fake plugin hooked into every Format block, so the
// test can see where a plugin's menu entries actually end up.
const renderToolbar = () => {
  const saved = new Map();
  for (const block of BLOCKS) {
    const name = `eejsBlock_${block}`;
    saved.set(name, pluginDefs.hooks[name]);
    pluginDefs.hooks[name] = [{
      hook_name: name,
      hook_fn: (hookName, args, cb) => {
        args.content += `<li id="from-${block}"></li>`;
        return cb();
      },
      hook_fn_name: `menu_blocks.js:${block}`,
      part: {plugin: 'ep_file_menu_toolbar_test'},
    }];
  }
  try {
    const args = {content: ''};
    require('../../../../eejs').eejsBlock_body('eejsBlock_body', args, () => {});
    return args.content;
  } finally {
    for (const [name, hooks] of saved) {
      if (hooks === undefined) delete pluginDefs.hooks[name];
      else pluginDefs.hooks[name] = hooks;
    }
  }
};

describe(__filename, function () {
  let html;
  let at;

  before(async function () {
    html = renderToolbar();
    at = (needle) => {
      const i = html.indexOf(needle);
      assert.notEqual(i, -1, `${needle} is missing from the rendered toolbar`);
      return i;
    };
  });

  it('puts dd_format_text in the character formatting group', async function () {
    // Right below Strikethrough, where ep_subscript_and_superscript and
    // friends belong — https://github.com/ether/ep_subscript_and_superscript/issues/17
    assert(at('data-key="strikethrough"') < at('id="from-dd_format_text"'));
    assert(at('id="from-dd_format_text"') < at('data-key="insertorderedlist"'));
  });

  it('puts dd_format_block in the paragraph formatting group', async function () {
    // Below Outdent: headings and alignment are line level formatting.
    assert(at('data-key="outdent"') < at('id="from-dd_format_block"'));
    assert(at('id="from-dd_format_block"') < at('id="from-dd_format"'));
  });

  it('keeps the legacy dd_format block after the built in entries', async function () {
    assert(at('data-key="outdent"') < at('id="from-dd_format"'));
  });

  // https://github.com/ether/ep_file_menu_toolbar/issues/21
  it('renders Clear Authorship Colors after everything plugins add', async function () {
    for (const block of BLOCKS) {
      assert(at(`id="from-${block}"`) < at('data-key="clearauthorship"'),
          `${block} content should render before Clear Authorship Colors`);
    }
  });

  it('closes every menu entry it opens', async function () {
    // An unclosed <li> used to leave an extra, label-less menu in the menu bar.
    const opened = html.match(/<li[\s>]/g) || [];
    const closed = html.match(/<\/li>/g) || [];
    assert.equal(opened.length - closed.length, 0,
        `${opened.length} <li> tags but ${closed.length} </li> tags`);
  });
});
