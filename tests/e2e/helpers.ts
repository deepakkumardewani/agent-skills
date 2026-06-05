import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { maintainer } from '../../src/lib/site';
import { getPhaseMeta, PHASE_ORDER } from '../../src/lib/skills';

export const PHASE_LABELS = PHASE_ORDER.map((phase) => getPhaseMeta(phase).label);

export const REPRESENTATIVE_SKILL_SLUG = 'api-and-interface-design';

export function isMobileProject(projectName: string): boolean {
  return projectName === 'mobile-chromium';
}

export async function waitForIslandHydration(page: Page, componentName: string): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(
    (name) => {
      const island = [...document.querySelectorAll('astro-island')].find((node) => {
        const opts = node.getAttribute('opts') ?? '';
        const url = node.getAttribute('component-url') ?? '';
        return opts.includes(`"name":"${name}"`) || url.includes(name);
      });
      return Boolean(island && !island.hasAttribute('ssr'));
    },
    componentName,
    { timeout: 20_000 },
  );
}

export async function waitForSiteNavMenu(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width >= 960) {
    return;
  }

  await waitForIslandHydration(page, 'SiteNavMenu');
  await expect(page.getByRole('button', { name: 'Open site menu' })).toBeVisible({
    timeout: 15_000,
  });
}

export async function clickPrimaryNavLink(page: Page, linkName: string): Promise<void> {
  await waitForSiteNavMenu(page);

  const menuButton = page.getByRole('button', { name: 'Open site menu' });
  if (await menuButton.isVisible()) {
    await menuButton.click();
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: linkName }).click();
    return;
  }

  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: linkName })
    .click();
}

export async function expectPrimaryNavLinks(page: Page): Promise<void> {
  await waitForSiteNavMenu(page);

  const menuButton = page.getByRole('button', { name: 'Open site menu' });
  if (await menuButton.isVisible()) {
    await menuButton.click();
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Quick start' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'About' })).toBeVisible();
    await menu.getByRole('button', { name: 'Close site menu' }).last().click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    return;
  }

  const primaryNav = page.getByRole('navigation', { name: 'Primary' });
  await expect(primaryNav.getByRole('link', { name: 'Docs' })).toBeVisible();
  await expect(primaryNav.getByRole('link', { name: 'Quick start' })).toBeVisible();
  await expect(primaryNav.getByRole('link', { name: 'About' })).toBeVisible();
}

export async function openSearchDialog(page: Page): Promise<void> {
  const dialog = page.getByRole('dialog', { name: 'Search skills' });
  if (await dialog.isVisible()) {
    await expect(searchInput(page)).toBeVisible();
    return;
  }

  const isMac = process.platform === 'darwin';
  const shortcut = isMac ? 'Meta+k' : 'Control+k';

  await page.keyboard.press(shortcut);

  try {
    await expect(dialog).toBeVisible({ timeout: 2_000 });
  } catch {
    await page.waitForFunction(
      () => document.getElementById('search-dialog-root')?.dataset.mounted === 'true',
      { timeout: 15_000 },
    );
  }

  // Avoid a second Cmd/Ctrl+K — it toggles closed when mount used initialOpen: true.
  if (!(await dialog.isVisible())) {
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('site-search:open'));
    });
  }

  await expect(dialog).toBeVisible({ timeout: 15_000 });
  await expect(searchInput(page)).toBeVisible({ timeout: 15_000 });
}

export async function openSearchViaClick(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Search skills' }).click();
  await expect(page.getByRole('dialog', { name: 'Search skills' })).toBeVisible({
    timeout: 15_000,
  });
  await expect(searchInput(page)).toBeVisible({ timeout: 15_000 });
}

export async function closeSearchDialog(page: Page): Promise<void> {
  const dialog = page.getByRole('dialog', { name: 'Search skills' });
  if (!(await dialog.isVisible())) {
    return;
  }

  await searchInput(page).press('Escape');
  await expect(dialog).toBeHidden({ timeout: 15_000 });
}

export async function openSkillsNav(page: Page, isMobile: boolean): Promise<void> {
  if (isMobile) {
    await waitForIslandHydration(page, 'MobileNav');
    const trigger = page.getByRole('button', { name: 'Open skills navigation' });
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Skills navigation' })).toBeVisible();
    return;
  }

  await expect(page.getByRole('navigation', { name: 'Skills by lifecycle phase' })).toBeVisible();
}

export function skillsNavLocator(page: Page, isMobile: boolean) {
  if (isMobile) {
    return page.getByRole('dialog', { name: 'Skills navigation' });
  }

  return page.getByRole('navigation', { name: 'Skills by lifecycle phase' });
}

export function searchInput(page: Page) {
  return page.locator('#site-search-input');
}

export function themeToggle(page: Page) {
  return page.locator('button.theme-toggle');
}

export async function waitForThemeToggle(page: Page) {
  const toggle = themeToggle(page);
  await expect(toggle).toBeVisible();
  return toggle;
}

export function maintainerLink(page: Page) {
  return page.getByRole('link', { name: maintainer.name });
}
