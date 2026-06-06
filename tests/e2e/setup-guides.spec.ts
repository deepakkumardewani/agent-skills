import { expect, test } from '@playwright/test';
import { waitForIslandHydration } from './helpers';

test.describe('setup guide pages', () => {
  test('quickstart Cursor link navigates to on-site setup guide', async ({ page }) => {
    await page.goto('/quickstart');
    await waitForIslandHydration(page, 'QuickstartTools');

    const cursorSection = page.locator('.quickstart-tool').filter({
      has: page.getByText('Cursor', { exact: true }),
    });
    await cursorSection.locator('summary').click();
    await cursorSection.getByRole('link', { name: 'Cursor setup guide' }).click();

    await expect(page).toHaveURL('/docs/setup/cursor');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Using agent-skills with Cursor' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('navigation', { name: 'Breadcrumb' })
        .getByRole('link', { name: 'Quick start' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Setup' })).toBeVisible();
  });

  test('breadcrumb returns to quickstart', async ({ page }) => {
    await page.goto('/docs/setup/gemini-cli');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Using agent-skills with Gemini CLI' }),
    ).toBeVisible();

    await page
      .locator('.setup-guide-page__breadcrumb')
      .getByRole('link', { name: 'Quick start' })
      .click();
    await expect(page).toHaveURL('/quickstart');
  });

  test('getting-started guide rewrites skill-anatomy link', async ({ page }) => {
    await page.goto('/docs/setup/getting-started');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Getting Started with agent-skills' }),
    ).toBeVisible();

    const anatomyLink = page.locator('.setup-guide-page__body').getByRole('link', {
      name: 'skill-anatomy.md',
    });
    await expect(anatomyLink).toHaveAttribute('href', '/docs#how-skills-work');
  });

  test('no console errors on setup guide load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    await page.goto('/docs/setup/cursor');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Using agent-skills with Cursor' }),
    ).toBeVisible();

    expect(errors).toEqual([]);
  });
});
