import { expect, test } from '@playwright/test';
import { formatSkillDisplayName } from '../../src/lib/skills';
import { mockClipboard, waitForCopyableCommand } from './helpers';

const leadSlug = 'incremental-implementation';
const nonLeadSlug = 'api-and-interface-design';
const leadDisplayName = formatSkillDisplayName(leadSlug);
const nonLeadDisplayName = formatSkillDisplayName(nonLeadSlug);

test.describe('skill page', () => {
  test.beforeEach(async ({ page }) => {
    await mockClipboard(page);
  });

  test('lead skill header shows phase chip and copyable trigger command', async ({ page }) => {
    await page.goto(`/docs/skills/${leadSlug}`);

    const header = page.locator('.skill-header-card');
    await expect(header.getByRole('heading', { level: 1, name: leadDisplayName })).toBeVisible();
    await expect(header.locator('.phase-chip')).toHaveText('Build');
    await expect(await waitForCopyableCommand(page, '/build')).toBeVisible();
    await expect(header.getByText('Activates automatically')).toHaveCount(0);
  });

  test('non-lead skill shows automatic activation note without phase command', async ({ page }) => {
    await page.goto(`/docs/skills/${nonLeadSlug}`);

    const header = page.locator('.skill-header-card');
    await expect(header.getByRole('heading', { level: 1, name: nonLeadDisplayName })).toBeVisible();
    await expect(header.getByText('Activates automatically')).toBeVisible();
    await expect(header.locator('.copyable-command')).toHaveCount(0);
  });

  test('copy command button writes to clipboard for lead skills', async ({ page }) => {
    await page.goto(`/docs/skills/${leadSlug}`);

    await (await waitForCopyableCommand(page, '/build')).click();

    const clipboardText = await page.evaluate(async () => navigator.clipboard.readText());
    expect(clipboardText).toBe('/build');
  });

  test('SKILL.md body renders in prose', async ({ page }) => {
    await page.goto(`/docs/skills/${leadSlug}`);

    const prose = page.locator('.skill-page__body.prose');
    await expect(prose).toBeVisible();
    await expect(prose.locator('h2, h3, p').first()).toBeVisible();
  });

  test('related skills appear when present', async ({ page }) => {
    await page.goto(`/docs/skills/${nonLeadSlug}`);

    const related = page.locator('.related-skills');
    await expect(related.getByRole('heading', { level: 2, name: 'Related skills' })).toBeVisible();
    await expect(related.getByRole('link', { name: /Deprecation and Migration/i })).toHaveAttribute(
      'href',
      '/docs/skills/deprecation-and-migration',
    );
  });
});
