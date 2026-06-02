import { expect, test } from '@playwright/test';
import { waitForThemeToggle } from './helpers';

test.describe('theme toggle', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      if (sessionStorage.getItem('__themeTestResetDone')) {
        return;
      }
      sessionStorage.setItem('__themeTestResetDone', '1');
      localStorage.removeItem('theme');
    });
  });

  test('toggle flips data-theme', async ({ page }) => {
    await page.goto('/');

    const toggle = await waitForThemeToggle(page);
    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    await toggle.click();

    await expect
      .poll(async () => page.evaluate(() => document.documentElement.dataset.theme))
      .not.toBe(initialTheme);
  });

  test('preference persists across navigation and reload', async ({ page }) => {
    await page.goto('/');

    const toggle = await waitForThemeToggle(page);
    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    await toggle.click();

    await expect
      .poll(async () => page.evaluate(() => document.documentElement.dataset.theme))
      .not.toBe(initialTheme);

    const storedTheme = await page.evaluate(() => document.documentElement.dataset.theme);

    await page.goto('/docs');
    await expect
      .poll(async () => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe(storedTheme);

    await page.reload();
    await expect
      .poll(async () => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe(storedTheme);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(storedTheme);
  });
});
