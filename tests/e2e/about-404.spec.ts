import { expect, test } from '@playwright/test';

test.describe('/404', () => {
  test('shows not-found message and docs CTA', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-for-e2e');

    expect(response?.status()).toBe(404);

    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    await expect(page.getByText("This page doesn't exist.")).toBeVisible();

    const docsLink = page.getByRole('link', { name: 'Back to docs →' });
    await expect(docsLink).toHaveAttribute('href', '/docs');
    await docsLink.click();
    await expect(page).toHaveURL('/docs');
  });
});
