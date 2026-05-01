import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad, writeToPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_file_menu_toolbar', () => {
  test('Uses file menu to toggle bold', async ({page}) => {
    const padBody = await getPadBody(page);
    await padBody.click();
    await clearPadContent(page);
    await writeToPad(page, 'hello world');

    // Select all the text in the pad.
    await page.keyboard.press('ControlOrMeta+A');

    // The bold entry lives inside the collapsed "Format" submenu, which the
    // jquery-css dropdown plugin only expands on hover. Skipping the
    // actionability check keeps the test honest about what it's asserting:
    // clicking the bold menu link runs its onclick handler and toggles bold.
    const boldEntry = page.locator('.dropdown-menu #bold > a');
    await boldEntry.click({force: true});
    await expect(padBody.locator('div').first().locator('b')).toHaveCount(1);
    await expect(padBody.locator('div').first()).toHaveText('hello world');

    // Re-select and click again to disable.
    await page.keyboard.press('ControlOrMeta+A');
    await boldEntry.click({force: true});
    await expect(padBody.locator('div').first().locator('b')).toHaveCount(0);
    await expect(padBody.locator('div').first()).toHaveText('hello world');
  });
});
