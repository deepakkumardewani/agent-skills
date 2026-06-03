import { expect, test } from '@playwright/test';
import { openSearchDialog, searchInput } from './helpers';

test.describe('site header', () => {
  test('primary nav has Docs and About only (no GitHub text link)', async ({ page }) => {
    await page.goto('/');

    const primaryNav = page.getByRole('navigation', { name: 'Primary' });
    await expect(primaryNav.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(primaryNav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(primaryNav.getByRole('link', { name: 'GitHub' })).toHaveCount(0);
  });

  test('GitHub icon sits immediately before the theme toggle', async ({ page }) => {
    await page.goto('/');

    const github = page.getByRole('link', { name: 'GitHub repository' });
    await expect(github).toBeVisible();
    await expect(github).toHaveAttribute('href', 'https://github.com/addyosmani/agent-skills');
    await expect(github).toHaveAttribute('target', '_blank');

    const actionKeys = await page.locator('.site-header__actions').evaluate((actions) => {
      return [...actions.children]
        .map((child) => {
          if (child.id === 'site-search-trigger') return 'search';
          if (child.matches('.site-header__github')) return 'github';
          if (child.matches('[data-theme-toggle]')) return 'theme';
          return null;
        })
        .filter((key): key is string => key !== null);
    });

    expect(actionKeys).toEqual(['search', 'github', 'theme']);

    const githubIndex = actionKeys.indexOf('github');
    const themeIndex = actionKeys.indexOf('theme');
    expect(githubIndex).toBeGreaterThan(-1);
    expect(themeIndex).toBe(githubIndex + 1);
  });

  test('brand wordmark is visible with focusable home link', async ({ page }) => {
    await page.goto('/');

    const brand = page.locator('.site-header__brand');
    await expect(brand).toBeVisible();
    await expect(brand.locator('.site-header__mark')).toBeVisible();
    await expect(brand.locator('.site-header__wordmark-accent')).toHaveText('skills');
    await brand.focus();
    await expect(brand).toBeFocused();
  });

  test('search opens via click and keyboard shortcut', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Search skills' }).click();
    await expect(page.getByRole('dialog', { name: 'Search skills' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Search skills' })).toBeHidden();

    await openSearchDialog(page);
    await expect(searchInput(page)).toBeVisible();
  });
});
