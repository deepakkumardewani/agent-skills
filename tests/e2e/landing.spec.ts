import { expect, test } from '@playwright/test';
import { ADLC_COMMAND_ROWS } from '../../src/lib/adlc-cycle';
import { isMobileProject } from './helpers';

const HERO_TITLE = 'Production-grade engineering skills for AI coding agents';

test.describe('landing page', () => {
  test('renders hero and ADLC section', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), 'Desktop browsers only');

    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: HERO_TITLE })).toBeVisible();

    await expect(
      page.getByRole('heading', { level: 2, name: 'The AI Development Lifecycle' }),
    ).toBeVisible();
  });

  test('hero spans the marketing container width', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), 'Desktop browsers only');

    await page.goto('/');

    const widths = await page.evaluate(() => {
      const shell = document.querySelector('.marketing-shell');
      const hero = document.querySelector('.landing-hero');
      if (!shell || !hero) {
        return { hero: 0, content: 0 };
      }
      const style = getComputedStyle(shell);
      const horizontalPadding =
        Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
      const contentWidth = shell.clientWidth - horizontalPadding;
      return { hero: hero.clientWidth, content: contentWidth };
    });

    expect(widths.content).toBeGreaterThan(0);
    expect(widths.hero).toBeCloseTo(widths.content, 0);
    expect(widths.hero).toBeGreaterThan(900);
  });

  test('Commands section lists all seven slash commands with key principles', async ({
    page,
  }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), 'Desktop browsers only');

    await page.goto('/');

    const section = page
      .getByRole('region', { name: 'Commands' })
      .or(page.locator('.commands-table'));
    await expect(page.getByRole('heading', { level: 2, name: 'Commands' })).toBeVisible();

    for (const row of ADLC_COMMAND_ROWS) {
      await expect(section.getByRole('cell', { name: row.task, exact: true })).toBeVisible();
      await expect(section.getByRole('cell', { name: row.command, exact: true })).toBeVisible();
      await expect(section.getByRole('cell', { name: row.principle, exact: true })).toBeVisible();
    }
  });

  test('homepage copy does not mention Foundations', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), 'Desktop browsers only');

    await page.goto('/');

    const mainText = await page.locator('.marketing-shell').innerText();
    expect(mainText).not.toMatch(/Foundations/i);
    await expect(page.getByRole('heading', { name: 'Browse by phase' })).toHaveCount(0);
    await expect(page.locator('.landing-hero__meta')).toContainText('Meta plus seven ADLC phases');
    await expect(page.getByRole('link', { name: 'Meta skills' })).toHaveAttribute(
      'href',
      '/docs#phase-meta',
    );
  });

  test('Browse skills CTA navigates to docs', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), 'Desktop browsers only');

    await page.goto('/');

    await page.getByRole('link', { name: 'Browse skills →' }).click();
    await expect(page).toHaveURL('/docs');
  });
});
