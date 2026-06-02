import { expect, test } from '@playwright/test';
import { openSearchDialog, searchInput } from './helpers';

test.describe('search dialog', () => {
  test('Cmd/Ctrl+K opens dialog', async ({ page }) => {
    await page.goto('/');

    await openSearchDialog(page);
    await expect(searchInput(page)).toBeVisible();
  });

  test('typing filters results', async ({ page }) => {
    await page.goto('/docs');
    await page.waitForFunction(
      () => document.getElementById('search-dialog-root')?.dataset.mounted === 'true',
      {
        timeout: 20_000,
      },
    );
    await page.getByRole('button', { name: 'Search skills' }).click();
    await expect(page.getByRole('dialog', { name: 'Search skills' })).toBeVisible();
    await searchInput(page).fill('spec driven');
    await expect(page.getByRole('listbox', { name: 'Search results' })).toBeVisible({
      timeout: 10_000,
    });

    const specResult = page.getByRole('option', { name: /Spec Driven Development/i });
    await expect(specResult).toBeVisible({ timeout: 10_000 });
    await expect(specResult).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('option', { name: /Context Engineering/i })).toHaveCount(0);
  });

  test('arrow keys and Enter navigate to a skill', async ({ page }) => {
    await page.goto('/');

    await openSearchDialog(page);
    await searchInput(page).fill('test driven');
    await expect(page.getByRole('listbox', { name: 'Search results' })).toBeVisible({
      timeout: 10_000,
    });

    const firstResult = page.getByRole('option', { name: /Test Driven Development/i });
    await expect(firstResult).toBeVisible({ timeout: 10_000 });
    await expect(firstResult).toHaveAttribute('aria-selected', 'true', { timeout: 10_000 });
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('/docs/skills/test-driven-development');
  });
});
