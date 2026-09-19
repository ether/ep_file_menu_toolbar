import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad, writeToPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

// The dropdown plugin flattens the menu markup, so the entries of a menu end
// up as direct children of its <ul>. Describe each child by the data-key of
// its link (or HR for a separator) to get a readable signature of the menu.
const menuSignature = async (page: import('@playwright/test').Page, title: string) =>
  await page.locator(`.dropdown-menu > li:has(> a:text-is("${title}")) > ul`)
      .evaluate((ul) => [...ul.children]
          .filter((el) => el.tagName === 'HR' || el.querySelector(':scope > a'))
          .map((el) => el.tagName === 'HR'
            ? 'HR'
            : (el.querySelector(':scope > a')!.getAttribute('data-key') || el.id || 'li')));

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_file_menu_toolbar format menu', () => {
  // https://github.com/ether/ep_file_menu_toolbar/issues/21
  test('Clear Authorship Colors sits alone in the last group of Format', async ({page}) => {
    const entries = await menuSignature(page, 'Format');

    // It is the last entry of the menu, and a separator puts it in a group of
    // its own — it used to sit between the formatting commands and everything
    // plugins add to the Format menu.
    expect(entries[entries.length - 1]).toBe('clearauthorship');
    expect(entries[entries.length - 2]).toBe('HR');
    expect(entries.filter((e) => e === 'clearauthorship')).toHaveLength(1);
  });

  test('Format keeps character formatting, then paragraph formatting', async ({page}) => {
    const entries = await menuSignature(page, 'Format');
    // The first group is the character formatting one, and the paragraph
    // formatting commands come after it, each behind a separator. Plugins are
    // appended to the end of the group they belong in, so only the relative
    // order of the built in entries is pinned here.
    expect(entries.slice(0, 4))
        .toEqual(['bold', 'italic', 'underline', 'strikethrough']);
    expect(entries.indexOf('insertorderedlist'))
        .toBeLessThan(entries.indexOf('outdent'));
    // Group boundaries: a separator between the character formatting group and
    // the paragraph one, and one before the clear authorship colours group.
    for (const [before, after] of [
      ['strikethrough', 'insertorderedlist'],
      ['outdent', 'clearauthorship'],
    ]) {
      expect(entries.indexOf(before)).toBeLessThan(entries.indexOf(after));
      expect(entries.slice(entries.indexOf(before), entries.indexOf(after)))
          .toContain('HR');
    }
  });

  test('menu bar has no empty entries', async ({page}) => {
    const titles = await page.locator('.dropdown-menu > li > a').allTextContents();
    expect(titles.map((t) => t.trim())).toEqual(
        ['File', 'Edit', 'Format', 'Insert', 'View', 'Help']);
    // An unclosed <li> used to leave an extra, label-less menu between Edit
    // and Format, so count the menus too and not just the labels.
    await expect(page.locator('.dropdown-menu > li')).toHaveCount(titles.length);
  });

  test('Edit menu undoes and redoes', async ({page}) => {
    const padBody = await getPadBody(page);
    await padBody.click();
    await clearPadContent(page);
    await writeToPad(page, 'hello world');
    const firstLine = padBody.locator('div').first();
    await expect(firstLine).toHaveText('hello world');

    // The entries live inside the collapsed "Edit" submenu, which the
    // jquery-css dropdown plugin only expands on hover. dispatchEvent fires
    // the click straight at the element regardless of visibility.
    await page.locator(".dropdown-menu a[data-key='undo']").dispatchEvent('click');
    await expect(firstLine).not.toHaveText('hello world');

    await page.locator(".dropdown-menu a[data-key='redo']").dispatchEvent('click');
    await expect(firstLine).toHaveText('hello world');
  });
});
