import { expect, test } from '@playwright/test';
import { formatSkillDisplayName } from '../../src/lib/skills';
import { mockClipboard, REPRESENTATIVE_SKILL_SLUG, waitForCopyableCommand } from './helpers';

const skillSlug = REPRESENTATIVE_SKILL_SLUG;
const displayName = formatSkillDisplayName(skillSlug);
const triggerCommand = '/build';

test.describe('skill page', () => {
  test.beforeEach(async ({ page }) => {
    await mockClipboard(page);
  });

  test('header card shows name, phase chip, and trigger command', async ({ page }) => {
    await page.goto(`/docs/skills/${skillSlug}`);

    const header = page.locator('.skill-header-card');
    await expect(header.getByRole('heading', { level: 1, name: displayName })).toBeVisible();
    await expect(header.locator('.phase-chip')).toHaveText('Build');
    await expect(await waitForCopyableCommand(page, triggerCommand)).toBeVisible();
  });

  test('copy command button writes to clipboard', async ({ page }) => {
    await page.goto(`/docs/skills/${skillSlug}`);

    await (await waitForCopyableCommand(page, triggerCommand)).click();

    const clipboardText = await page.evaluate(async () => navigator.clipboard.readText());
    expect(clipboardText).toBe(triggerCommand);
  });

  test('SKILL.md body renders in prose', async ({ page }) => {
    await page.goto(`/docs/skills/${skillSlug}`);

    const prose = page.locator('.skill-page__body.prose');
    await expect(prose).toBeVisible();
    await expect(prose.locator('h2, h3, p').first()).toBeVisible();
  });

  test('related skills appear when present', async ({ page }) => {
    await page.goto(`/docs/skills/${skillSlug}`);

    const related = page.locator('.related-skills');
    await expect(related.getByRole('heading', { level: 2, name: 'Related skills' })).toBeVisible();
    await expect(related.getByRole('link', { name: /Deprecation And Migration/i })).toHaveAttribute(
      'href',
      '/docs/skills/deprecation-and-migration',
    );
  });
});
