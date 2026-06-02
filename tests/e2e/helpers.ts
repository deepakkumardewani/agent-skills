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

export async function openSearchDialog(page: Page): Promise<void> {
  const isMac = process.platform === 'darwin';
  await page.keyboard.press(isMac ? 'Meta+k' : 'Control+k');

  const dialog = page.getByRole('dialog', { name: 'Search skills' });
  if (await dialog.isHidden()) {
    await page.getByRole('button', { name: 'Search skills' }).click();
  }

  await expect(dialog).toBeVisible({ timeout: 15_000 });
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

export async function mockClipboard(page: Page): Promise<void> {
  await page.addInitScript(() => {
    let stored = '';
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          stored = text;
        },
        readText: async () => stored,
      },
    });
  });
}

export async function waitForCopyableCommand(page: Page, command: string) {
  await page.locator('.skill-header-card').scrollIntoViewIfNeeded();
  const button = page.getByRole('button', { name: `Copy command ${command}` });
  await expect(button).toBeVisible();
  return button;
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
