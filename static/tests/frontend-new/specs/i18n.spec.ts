import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

// Every label in the menu, with the key it must be translated through. The
// plugin's own keys live in locales/en.json; the rest are core keys that
// already carry translations for every language Etherpad ships.
const LABELS: [string, string][] = [
  ['File', 'ep_file_menu_toolbar.file'],
  ['New Pad', 'index.newPad'],
  ['Save Revision', 'ep_file_menu_toolbar.save'],
  ['Import Now', 'pad.impexp.importbutton'],
  ['Export current pad as:', 'pad.importExport.export'],
  ['Timeslider', 'ep_file_menu_toolbar.timeslider'],
  ['Pad-wide Settings', 'pad.settings.padSettings'],
  ['Print', 'ep_file_menu_toolbar.print'],
  ['Share & Embed', 'ep_file_menu_toolbar.embed'],
  ['Edit', 'ep_file_menu_toolbar.edit'],
  ['Undo (Ctrl+Z)', 'ep_file_menu_toolbar.undo'],
  ['Redo (Ctrl+Y)', 'ep_file_menu_toolbar.redo'],
  ['Format', 'ep_file_menu_toolbar.format'],
  ['Bold (Ctrl+B)', 'ep_file_menu_toolbar.bold'],
  ['Italic (Ctrl+I)', 'ep_file_menu_toolbar.italic'],
  ['Underline (Ctrl+U)', 'ep_file_menu_toolbar.underline'],
  ['Strikethrough (Ctrl+5)', 'ep_file_menu_toolbar.strikethrough'],
  ['Ordered list (Ctrl+Shift+N)', 'ep_file_menu_toolbar.orderedList'],
  ['Unordered list (Ctrl+Shift+L)', 'ep_file_menu_toolbar.unorderedList'],
  ['Indent (TAB)', 'ep_file_menu_toolbar.indent'],
  ['Outdent (Shift+TAB)', 'ep_file_menu_toolbar.outdent'],
  ['Clear Authorship Colors (Ctrl+Shift+C)', 'ep_file_menu_toolbar.clearAuthorship'],
  ['Insert', 'ep_file_menu_toolbar.insert'],
  ['View', 'ep_file_menu_toolbar.view'],
  ['Authorship colors', 'pad.settings.colorcheck'],
  ['Line numbers', 'pad.settings.linenocheck'],
  ['Chat always on screen', 'pad.settings.stickychat'],
  ['Read content from right to left?', 'pad.settings.rtlcheck'],
  ['Help', 'ep_file_menu_toolbar.help'],
  ['File Menu Toolbar plugin by John McLear', 'ep_file_menu_toolbar.about'],
];

// The export submenu is cloned from core's export links at runtime, so those
// entries are already translated by core and carry no key of their own.
const menuLinks = async (page: import('@playwright/test').Page) =>
  await page.locator('.dropdown-menu a').evaluateAll((links) => links
      .filter((a) => !a.classList.contains('exportlink'))
      .map((a) => ({text: a.textContent!.trim(), key: a.getAttribute('data-l10n-id')})));

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_file_menu_toolbar i18n', () => {
  test('every menu entry is translated through a key', async ({page}) => {
    // Other plugins may add entries of their own to the menu, so check that
    // the plugin's own entries are all there rather than pinning the list.
    const links = await menuLinks(page);
    for (const [label, key] of LABELS) {
      expect(links, `no entry "${label}" with key ${key}`)
          .toContainEqual({text: label, key});
    }
  });

  test('the displayed label is what the key resolves to', async ({page}) => {
    // A key core cannot resolve leaves the hardcoded English from the template
    // on screen. Two ways that used to happen here: a key ending in `.title`
    // only ever sets the title attribute (html10n treats the last segment as
    // an attribute name), and a label wrapped in markup such as
    // `<u>B</u>old` gets the translation appended to the leftover `B`.
    for (const [label, key] of LABELS) {
      const resolved = await page.evaluate((k) => (window as any).html10n.get(k), key);
      expect(resolved, `${key} does not resolve`).toBe(label);
    }
    const links = await menuLinks(page);
    for (const [, key] of LABELS) {
      const link = links.find((l) => l.key === key)!;
      const resolved = await page.evaluate((k) => (window as any).html10n.get(k), key);
      expect(link.text, `${key} is not applied to the label`).toBe(resolved);
    }
  });

  test('the plugin locales file is served by core', async ({page}) => {
    const locales = await page.evaluate(async () =>
      await (await fetch('/locales/en')).json());
    expect(Object.keys(locales.en).filter((k) => k.startsWith('ep_file_menu_toolbar.')))
        .toHaveLength(22);
  });
});
