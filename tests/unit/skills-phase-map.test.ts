import { describe, expect, it } from 'vitest';
import {
  LEAD_SKILL_BY_COMMAND,
  PHASE_META,
  PHASE_ORDER,
  SKILL_PHASE_MAP,
} from '../../scripts/skills-phase-map';
import { buildTriggers } from '../../scripts/sync-skills-lib';

const EXPECTED_PHASE_BY_SLUG: Record<string, (typeof PHASE_ORDER)[number]> = {
  'using-agent-skills': 'meta',
  'interview-me': 'define',
  'idea-refine': 'define',
  'spec-driven-development': 'define',
  'planning-and-task-breakdown': 'plan',
  'incremental-implementation': 'build',
  'test-driven-development': 'build',
  'context-engineering': 'build',
  'source-driven-development': 'build',
  'doubt-driven-development': 'build',
  'frontend-ui-engineering': 'build',
  'api-and-interface-design': 'build',
  'browser-testing-with-devtools': 'test',
  'debugging-and-error-recovery': 'test',
  'code-review-and-quality': 'review',
  'security-and-hardening': 'review',
  'performance-optimization': 'review',
  'code-simplification': 'simplify',
  'git-workflow-and-versioning': 'ship',
  'ci-cd-and-automation': 'ship',
  'deprecation-and-migration': 'ship',
  'documentation-and-adrs': 'ship',
  'shipping-and-launch': 'ship',
};

describe('skills-phase-map', () => {
  it('orders Meta first, then the seven ADLC phases', () => {
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
    expect(PHASE_META.meta).toEqual({ label: 'Meta', command: '' });
  });

  it('maps every skill slug to the spec §3.1 phase', () => {
    expect(Object.keys(SKILL_PHASE_MAP).sort()).toEqual(Object.keys(EXPECTED_PHASE_BY_SLUG).sort());
    for (const [slug, phase] of Object.entries(EXPECTED_PHASE_BY_SLUG)) {
      expect(SKILL_PHASE_MAP[slug]).toBe(phase);
    }
  });

  it('maps each command to its lead skill slug', () => {
    expect(LEAD_SKILL_BY_COMMAND).toEqual({
      '/spec': 'spec-driven-development',
      '/plan': 'planning-and-task-breakdown',
      '/build': 'incremental-implementation',
      '/test': 'test-driven-development',
      '/review': 'code-review-and-quality',
      '/code-simplify': 'code-simplification',
      '/ship': 'shipping-and-launch',
    });
  });
});

describe('buildTriggers', () => {
  it('returns the lead command for lead skills regardless of phase grouping', () => {
    expect(buildTriggers('spec-driven-development', 'define')).toEqual(['/spec']);
    expect(buildTriggers('incremental-implementation', 'build')).toEqual(['/build']);
    expect(buildTriggers('test-driven-development', 'build')).toEqual(['/test']);
    expect(buildTriggers('idea-refine', 'define')).toEqual([]);
    expect(buildTriggers('api-and-interface-design', 'build')).toEqual([]);
  });

  it('returns no triggers for meta skills', () => {
    expect(buildTriggers('using-agent-skills', 'meta')).toEqual([]);
  });
});
