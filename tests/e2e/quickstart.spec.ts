import { expect, test } from '@playwright/test';
import { clickPrimaryNavLink, waitForIslandHydration } from './helpers';

const TOOL_SECTIONS = [
  { name: 'Claude Code', badge: 'Recommended' },
  { name: 'Cursor' },
  { name: 'Gemini CLI' },
  { name: 'Windsurf' },
  { name: 'OpenCode' },
  { name: 'GitHub Copilot' },
  { name: 'Kiro IDE & CLI' },
  { name: 'Codex / Other Agents' },
] as const;

test.describe('quick start page', () => {
  test('renders all tool sections', async ({ page }) => {
    await page.goto('/quickstart');

    await expect(page.getByRole('heading', { level: 1, name: 'Quick start' })).toBeVisible();

    for (const tool of TOOL_SECTIONS) {
      const section = page.locator('.quickstart-tool').filter({
        has: page.getByText(tool.name, { exact: true }),
      });
      await expect(section).toBeVisible();
      if ('badge' in tool && tool.badge) {
        await expect(section.getByText(tool.badge, { exact: true })).toBeVisible();
      }
    }
  });

  test('copy button copies install command', async ({ page, context }, testInfo) => {
    test.skip(
      testInfo.project.name === 'webkit',
      'WebKit Playwright does not support clipboard-write permission',
    );

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/quickstart');

    await waitForIslandHydration(page, 'QuickstartTools');

    const command = '/plugin marketplace add addyosmani/agent-skills';
    const row = page.locator('[data-copyable-command]').filter({ hasText: command }).first();
    await expect(row).toBeVisible();

    await row.getByRole('button', { name: 'Copy command' }).click();
    await expect(row.getByRole('button', { name: 'Copied' })).toBeVisible();

    const clipboardText = await page.evaluate(async () => navigator.clipboard.readText());
    expect(clipboardText).toBe(command);
  });

  test('header nav and hero link resolve', async ({ page }) => {
    await page.goto('/');

    await clickPrimaryNavLink(page, 'Quick start');
    await expect(page).toHaveURL('/quickstart');

    await page.goto('/');
    await page.locator('.landing-hero').getByRole('link', { name: 'Quick start' }).click();
    await expect(page).toHaveURL('/quickstart');
  });

  test('docs index links to quick start', async ({ page }) => {
    await page.goto('/docs');

    await page.locator('.docs-index__actions').getByRole('link', { name: 'Quick start' }).click();
    await expect(page).toHaveURL('/quickstart');
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    await page.goto('/quickstart');
    await expect(page.getByRole('heading', { level: 1, name: 'Quick start' })).toBeVisible();

    expect(errors).toEqual([]);
  });
});
