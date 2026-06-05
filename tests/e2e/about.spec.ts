import { expect, test } from '@playwright/test';
import { addy } from '../../src/lib/site';
import { maintainerLink } from './helpers';

test.describe('/about', () => {
  test('shows tribute copy', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { level: 1, name: 'Why I created this' })).toBeVisible();
    await expect(page.getByText(/not an official Addy Osmani project/i)).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'A personal tribute' })).toBeVisible();
    await expect(page.getByText(/Foundations/i)).toHaveCount(0);
  });

  test('Addy link points to upstream repo', async ({ page }) => {
    await page.goto('/about');

    const addyLink = page.getByRole('link', { name: "Addy Osmani's agent-skills" }).first();
    await expect(addyLink).toHaveAttribute('href', addy.repoUrl);
  });

  test('maintainer link works', async ({ page }) => {
    await page.goto('/about');

    const link = maintainerLink(page);
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://github.com/deepakkumardewani');
  });
});
