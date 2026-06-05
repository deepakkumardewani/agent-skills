import { expect, type Page, test } from '@playwright/test';
import { addy } from '../../src/lib/site';
import { maintainerLink } from './helpers';

function siteFooter(page: Page) {
  return page.locator('.site-footer');
}

test.describe('site footer', () => {
  test('shows tribute line on /about only', async ({ page }) => {
    await page.goto('/about');
    await expect(siteFooter(page).getByText('A tribute to')).toBeVisible();
    await expect(siteFooter(page).getByText('Based on')).toHaveCount(0);
  });

  test('uses minimal credit on / and /docs (no tribute wording)', async ({ page }) => {
    for (const path of ['/', '/docs'] as const) {
      await page.goto(path);
      const footer = siteFooter(page);
      await expect(footer.getByText('A tribute to')).toHaveCount(0);
      await expect(footer.getByText('Based on')).toBeVisible();
    }
  });

  test('every footer links to Addy upstream repo and credits maintainer', async ({ page }) => {
    for (const path of ['/', '/docs', '/about'] as const) {
      await page.goto(path);
      const footer = siteFooter(page);
      const addyLink = footer.getByRole('link', { name: "Addy Osmani's agent-skills" });
      await expect(addyLink).toBeVisible();
      await expect(addyLink).toHaveAttribute('href', addy.repoUrl);
      await expect(maintainerLink(page)).toBeVisible();
    }
  });
});
