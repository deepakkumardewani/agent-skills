import { expect, test } from '@playwright/test';
import {
  closeSearchDialog,
  expectPrimaryNavLinks,
  isMobileProject,
  openSearchDialog,
  openSearchViaClick,
  searchInput,
  waitForSiteNavMenu,
} from './helpers';

test.describe('site header', () => {
  test('primary nav has Docs, Quick start, and About (no GitHub text link)', async ({ page }) => {
    await page.goto('/');

    await expectPrimaryNavLinks(page);
    await expect(
      page.locator('.site-header__nav').getByRole('link', { name: 'GitHub' }),
    ).toHaveCount(0);
  });

  test('mobile header keeps a single row without inline nav links', async ({ page }, testInfo) => {
    test.skip(!isMobileProject(testInfo.project.name), 'Mobile browsers only');

    await page.goto('/');
    await waitForSiteNavMenu(page);

    await expect(page.getByRole('button', { name: 'Open site menu' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator('.site-header__nav')).toBeHidden();

    const layout = await page.evaluate(() => {
      const inner = document.querySelector('.site-header__inner');
      const start = document.querySelector('.site-header__start');
      const actions = document.querySelector('.site-header__actions');
      const nav = document.querySelector('.site-header__nav');
      if (!inner || !start || !actions || !nav) {
        return { compactHeader: false, navHidden: false };
      }
      const innerRect = inner.getBoundingClientRect();
      const startRect = start.getBoundingClientRect();
      const actionsRect = actions.getBoundingClientRect();
      return {
        compactHeader:
          Math.abs(startRect.top - actionsRect.top) <= 2 &&
          innerRect.height <= 72 &&
          startRect.bottom <= innerRect.bottom + 2 &&
          actionsRect.bottom <= innerRect.bottom + 2,
        navHidden: getComputedStyle(nav).display === 'none',
      };
    });

    expect(layout.navHidden).toBe(true);
    expect(layout.compactHeader).toBe(true);
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
        .filter((key): key is 'search' | 'github' | 'theme' => key !== null);
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
    await expect(brand.locator('.site-header__wordmark-accent')).toHaveText('agent-skills');
    await brand.focus();
    await expect(brand).toBeFocused();
  });

  test('search opens via click and keyboard shortcut', async ({ page }) => {
    await page.goto('/');

    await openSearchViaClick(page);
    await closeSearchDialog(page);

    await openSearchDialog(page);
    await expect(searchInput(page)).toBeVisible();
  });
});
