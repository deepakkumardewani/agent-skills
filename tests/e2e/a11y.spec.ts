import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Result } from 'axe-core';
import { REPRESENTATIVE_SKILL_SLUG } from './helpers';

const routes = [
  { name: 'landing', path: '/' },
  { name: 'docs index', path: '/docs' },
  { name: 'skill page', path: `/docs/skills/${REPRESENTATIVE_SKILL_SLUG}` },
  { name: 'about', path: '/about' },
] as const;

test.describe('accessibility', () => {
  for (const route of routes) {
    test(`${route.name} has no critical axe violations`, async ({ page }) => {
      await page.goto(route.path);

      const results = await new AxeBuilder({ page }).analyze();
      const critical = results.violations.filter((violation) => violation.impact === 'critical');

      expect(critical, formatViolations(critical)).toEqual([]);
    });
  }
});

function formatViolations(violations: Result[]): string {
  if (violations.length === 0) {
    return '';
  }

  return violations
    .map((violation) => `${violation.id}: ${violation.description}\n${violation.helpUrl}`)
    .join('\n\n');
}
