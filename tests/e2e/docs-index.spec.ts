import { expect, test } from '@playwright/test';
import { addy } from '../../src/lib/site';

const DOCS_SECTIONS = [
  'How skills work',
  'Meta',
  'The ADLC framework',
  'Agent Personas',
  'Reference Checklists',
  'Project Structure',
  'Why Agent Skills?',
  'Find a skill',
] as const;

const DESIGN_CHOICES = [
  'Process, not prose',
  'Anti-rationalization',
  'Verification is non-negotiable',
  'Progressive disclosure',
] as const;

const UPSTREAM_LINKS = [
  `${addy.repoUrl}/blob/main/agents/code-reviewer.md`,
  `${addy.repoUrl}/blob/main/agents/test-engineer.md`,
  `${addy.repoUrl}/blob/main/agents/security-auditor.md`,
  `${addy.repoUrl}/blob/main/references/testing-patterns.md`,
  `${addy.repoUrl}/blob/main/references/security-checklist.md`,
  `${addy.repoUrl}/blob/main/references/performance-checklist.md`,
  `${addy.repoUrl}/blob/main/references/accessibility-checklist.md`,
] as const;

test.describe('docs index', () => {
  test('renders all README-sourced sections', async ({ page }) => {
    await page.goto('/docs');

    const article = page.locator('.docs-index');
    await expect(article.getByRole('heading', { level: 1, name: 'Getting started' })).toBeVisible();

    for (const section of DOCS_SECTIONS) {
      await expect(article.getByRole('heading', { level: 2, name: section })).toBeVisible();
    }
  });

  test('how skills work includes anatomy and design choices', async ({ page }) => {
    await page.goto('/docs');

    const section = page.locator('.docs-index__section').filter({
      has: page.getByRole('heading', { level: 2, name: 'How skills work' }),
    });

    await expect(section.locator('pre code')).toContainText('SKILL.md');
    await expect(section.locator('pre code')).toContainText('Frontmatter');

    for (const choice of DESIGN_CHOICES) {
      await expect(section.getByText(choice, { exact: false })).toBeVisible();
    }
  });

  test('meta anchor resolves and Foundations is absent', async ({ page }) => {
    await page.goto('/docs#phase-meta');

    const metaSection = page.locator('#phase-meta');
    await expect(metaSection).toBeVisible();
    await expect(metaSection.getByRole('heading', { level: 2, name: 'Meta' })).toBeVisible();
    await expect(page.locator('.docs-index').getByText('Foundations', { exact: true })).toHaveCount(
      0,
    );
  });

  test('personas and checklists link to upstream repo', async ({ page }) => {
    await page.goto('/docs');

    for (const href of UPSTREAM_LINKS) {
      const link = page.locator(`a[href="${href}"]`);
      await expect(link).toBeVisible();
    }
  });

  test('project structure shows upstream tree', async ({ page }) => {
    await page.goto('/docs');

    const section = page.locator('.docs-index__section').filter({
      has: page.getByRole('heading', { level: 2, name: 'Project Structure' }),
    });

    await expect(section.locator('pre code')).toContainText('agent-skills/');
    await expect(section.locator('pre code')).toContainText('using-agent-skills/');
    await expect(section.locator('pre code')).toContainText('references/');
  });

  test('why agent skills includes README rationale', async ({ page }) => {
    await page.goto('/docs');

    const section = page.locator('.docs-index__section').filter({
      has: page.getByRole('heading', { level: 2, name: 'Why Agent Skills?' }),
    });

    await expect(section.getByText('shortest path', { exact: false })).toBeVisible();
    await expect(section.getByText('Software Engineering at Google')).toBeVisible();
    await expect(section.getByText("Hyrum's Law", { exact: false })).toBeVisible();
  });
});
