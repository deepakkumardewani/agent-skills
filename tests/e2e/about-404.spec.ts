import { expect, test } from '@playwright/test';
import { addy, site } from '../../src/lib/site';

test.describe('/about', () => {
  test('shows tribute copy and credits', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { level: 1, name: 'Why I created this' })).toBeVisible();
    await expect(page.getByText(/not an official Addy Osmani project/i)).toBeVisible();
    await expect(page.getByText(/Anthropic/i)).toHaveCount(0);

    const addyRepoLink = page.getByRole('link', { name: "Addy Osmani's agent-skills" }).first();
    await expect(addyRepoLink).toHaveAttribute('href', addy.repoUrl);

    const siteRepoLink = page.getByRole('link', { name: "this project's GitHub repository" });
    await expect(siteRepoLink).toHaveAttribute('href', site.repoUrl);
  });
});

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
