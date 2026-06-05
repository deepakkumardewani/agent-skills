import { expect, test } from '@playwright/test';
import { formatSkillDisplayName } from '../../src/lib/skills';

const skillSlug = 'incremental-implementation';
const displayName = formatSkillDisplayName(skillSlug);

test.describe('skill page', () => {
  test('lead skill header shows slash-command trigger', async ({ page }) => {
    await page.goto(`/docs/skills/${skillSlug}`);

    const header = page.locator('.skill-header-card');
    await expect(header.getByRole('heading', { level: 1, name: displayName })).toBeVisible();
    await expect(header.getByText('Trigger:')).toBeVisible();
    await expect(header.locator('code')).toHaveText('/build');
    await expect(header.locator('.phase-chip')).toHaveCount(0);
    await expect(header.getByRole('navigation', { name: 'Breadcrumb' })).toHaveCount(0);
  });

  test('non-lead skill header shows activates automatically', async ({ page }) => {
    await page.goto('/docs/skills/api-and-interface-design');

    const header = page.locator('.skill-header-card');
    await expect(header.getByText('Activates automatically')).toBeVisible();
    await expect(header.locator('code')).toHaveCount(0);
  });

  test('SKILL.md body renders in prose', async ({ page }) => {
    await page.goto(`/docs/skills/${skillSlug}`);

    const prose = page.locator('.skill-page__body.prose');
    await expect(prose).toBeVisible();
    await expect(prose.locator('h2, h3, p').first()).toBeVisible();
  });

  test('related skills appear when present', async ({ page }) => {
    await page.goto('/docs/skills/api-and-interface-design');

    const related = page.locator('.related-skills');
    await expect(related.getByRole('heading', { level: 2, name: 'Related skills' })).toBeVisible();
    await expect(related.getByRole('link', { name: /Deprecation and Migration/i })).toHaveAttribute(
      'href',
      '/docs/skills/deprecation-and-migration',
    );
  });
});
