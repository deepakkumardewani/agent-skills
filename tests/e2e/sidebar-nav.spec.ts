import { expect, test } from '@playwright/test';
import { formatSkillDisplayName } from '../../src/lib/skills';
import { isMobileProject, openSkillsNav, PHASE_LABELS, skillsNavLocator } from './helpers';

test.describe('sidebar navigation', () => {
  test('renders all 8 phase groups', async ({ page }, testInfo) => {
    const isMobile = isMobileProject(testInfo.project.name);
    await page.goto('/docs');
    await openSkillsNav(page, isMobile);

    const nav = skillsNavLocator(page, isMobile);
    for (const label of PHASE_LABELS) {
      await expect(nav.getByRole('heading', { name: new RegExp(label, 'i') })).toBeVisible();
    }
  });

  test('clicking a skill loads its page and updates active state', async ({ page }, testInfo) => {
    const isMobile = isMobileProject(testInfo.project.name);
    const targetSlug = 'spec-driven-development';
    const targetName = formatSkillDisplayName(targetSlug);

    await page.goto('/docs');
    await openSkillsNav(page, isMobile);

    const nav = skillsNavLocator(page, isMobile);
    await nav.getByRole('link', { name: targetName, exact: true }).click();

    await expect(page).toHaveURL(`/docs/skills/${targetSlug}`);

    if (isMobile) {
      await openSkillsNav(page, isMobile);
    }

    const activeNav = skillsNavLocator(page, isMobile);
    await expect(activeNav.getByRole('link', { name: targetName, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
