import { describe, expect, it } from 'vitest';
import { skillsData } from '../../src/data/skills-data';
import {
  formatSkillDisplayName,
  getPhaseMeta,
  getRelatedSkills,
  groupSkillsByPhase,
  PHASE_ORDER,
  sortSkillsAlphabetically,
} from '../../src/lib/skills';

describe('skills lib', () => {
  it('orders phases Foundations first, then the seven ADLC phases', () => {
    expect(PHASE_ORDER).toEqual([
      'foundations',
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
    expect(groups[0]?.label).toBe('Foundations');
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

    expect(getPhaseMeta('foundations')).toMatchObject({
      label: 'Foundations',
      command: '',
      fgVar: '--phase-foundations',
      subtleVar: '--phase-foundations-subtle',
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

  it('formats kebab-case skill names for display', () => {
    expect(formatSkillDisplayName('spec-driven-development')).toBe('Spec Driven Development');
    expect(formatSkillDisplayName('ci-cd-and-automation')).toBe('Ci Cd And Automation');
  });

  it('sorts skills alphabetically by formatted display name within a group', () => {
    const groups = groupSkillsByPhase();
    const foundations = groups[0];
    expect(foundations?.phase).toBe('foundations');

    const sorted = sortSkillsAlphabetically(foundations?.skills ?? []);
    const displayNames = sorted.map((skill) => formatSkillDisplayName(skill.name));
    expect(displayNames).toEqual([...displayNames].sort((a, b) => a.localeCompare(b)));
    expect(sorted.length).toBeGreaterThanOrEqual(5);
  });

  it('includes every synced skill in exactly one sidebar group', () => {
    const groups = groupSkillsByPhase();
    const sidebarSlugs = groups.flatMap((group) => group.skills.map((skill) => skill.slug));
    expect(sidebarSlugs.length).toBe(skillsData.skills.length);
    expect(new Set(sidebarSlugs).size).toBe(sidebarSlugs.length);
    expect(skillsData.skills.every((skill) => sidebarSlugs.includes(skill.slug))).toBe(true);
  });
});
