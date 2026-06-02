import { expect, test } from '@playwright/test';
import { isMobileProject } from './helpers';

test.describe('landing page', () => {
  test('renders hero and ADLC section', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), 'Desktop browsers only');

    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Agent skills for every phase of building with AI',
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { level: 2, name: 'The AI Development Lifecycle' }),
    ).toBeVisible();
  });

  test('Browse skills CTA navigates to docs', async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), 'Desktop browsers only');

    await page.goto('/');

    await page.getByRole('link', { name: 'Browse skills →' }).click();
    await expect(page).toHaveURL('/docs');
  });
});
