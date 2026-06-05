import { describe, expect, it } from 'vitest';
import { skillsData } from '../../src/data/skills-data';
import {
  formatSkillDisplayName,
  getPhaseMeta,
  getRelatedSkills,
  getSkillBySlug,
  groupSkillsByPhase,
  PHASE_ORDER,
  sortSkillsAlphabetically,
} from '../../src/lib/skills';

describe('skills lib', () => {
  it('orders phases Meta first, then the seven ADLC phases', () => {
    expect(PHASE_ORDER).toEqual([
      'meta',
      'define',
      'plan',
      'build',
      'test',
      'review',
      'simplify',
      'ship',
    ]);

    const groups = groupSkillsByPhase();
    expect(groups.map((group) => group.phase)).toEqual([...PHASE_ORDER]);
    expect(groups[0]?.label).toBe('Meta');
    expect(groups[1]?.command).toBe('/spec');
    expect(groups[7]?.command).toBe('/ship');
  });

  it('returns phase metadata with label, command, and color tokens', () => {
    expect(getPhaseMeta('define')).toEqual({
      phase: 'define',
      label: 'Define',
      command: '/spec',
      fgVar: '--phase-define',
      subtleVar: '--phase-define-subtle',
    });

    expect(getPhaseMeta('meta')).toMatchObject({
      label: 'Meta',
      command: '',
      fgVar: '--phase-meta',
      subtleVar: '--phase-meta-subtle',
    });
  });

  it('resolves related skills and drops unknown slugs', () => {
    const related = getRelatedSkills('test-driven-development');
    expect(related).toHaveLength(1);
    expect(related[0]?.slug).toBe('browser-testing-with-devtools');
  });

  it('returns an empty list when a skill has no related entries', () => {
    expect(getRelatedSkills('spec-driven-development')).toEqual([]);
    expect(getRelatedSkills('missing-skill')).toEqual([]);
  });

  it('looks up skills by slug', () => {
    expect(getSkillBySlug('spec-driven-development')?.phase).toBe('define');
    expect(getSkillBySlug('missing-skill')).toBeUndefined();
  });

  it('skips empty segments in kebab-case names', () => {
    expect(formatSkillDisplayName('foo--bar')).toBe('Foo Bar');
  });

  it.each([
    ['ci-cd-and-automation', 'CI/CD and Automation'],
    ['api-and-interface-design', 'API and Interface Design'],
    ['documentation-and-adrs', 'Documentation and ADRs'],
    ['code-review-and-quality', 'Code Review and Quality'],
    ['git-workflow-and-versioning', 'Git Workflow and Versioning'],
    ['security-and-hardening', 'Security and Hardening'],
    ['debugging-and-error-recovery', 'Debugging and Error Recovery'],
    ['deprecation-and-migration', 'Deprecation and Migration'],
    ['browser-testing-with-devtools', 'Browser Testing with DevTools'],
    ['using-agent-skills', 'Using Agent Skills'],
    ['frontend-ui-engineering', 'Frontend UI Engineering'],
    ['test-driven-development', 'Test Driven Development'],
  ] as const)('formats %s as "%s"', (slug, expected) => {
    expect(formatSkillDisplayName(slug)).toBe(expected);
  });

  it('sorts skills alphabetically by formatted display name within a group', () => {
    const groups = groupSkillsByPhase();
    const meta = groups[0];
    expect(meta?.phase).toBe('meta');

    const sorted = sortSkillsAlphabetically(meta?.skills ?? []);
    const displayNames = sorted.map((skill) => formatSkillDisplayName(skill.name));
    expect(displayNames).toEqual([...displayNames].sort((a, b) => a.localeCompare(b)));
    expect(sorted.length).toBeGreaterThanOrEqual(1);
  });

  it('includes every synced skill in exactly one sidebar group', () => {
    const groups = groupSkillsByPhase();
    const sidebarSlugs = groups.flatMap((group) => group.skills.map((skill) => skill.slug));
    expect(sidebarSlugs.length).toBe(skillsData.skills.length);
    expect(new Set(sidebarSlugs).size).toBe(sidebarSlugs.length);
    expect(skillsData.skills.every((skill) => sidebarSlugs.includes(skill.slug))).toBe(true);
  });
});
