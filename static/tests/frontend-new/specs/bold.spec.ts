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

    const boldEntry = page.locator('.dropdown-menu #bold > a');
    await boldEntry.click();
    await expect(padBody.locator('div').first().locator('b')).toHaveCount(1);
    await expect(padBody.locator('div').first()).toHaveText('hello world');

    // Re-select and click again to disable.
    await page.keyboard.press('ControlOrMeta+A');
    await boldEntry.click();
    await expect(padBody.locator('div').first().locator('b')).toHaveCount(0);
    await expect(padBody.locator('div').first()).toHaveText('hello world');
  });
});
