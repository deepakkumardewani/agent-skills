import { describe, expect, it } from 'vitest';
import {
  formatSkillDisplayName,
  getPhaseMeta,
  getRelatedSkills,
  groupSkillsByPhase,
  PHASE_ORDER,
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
});
