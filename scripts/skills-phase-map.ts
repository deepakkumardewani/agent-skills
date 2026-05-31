import type { Phase } from '../src/data/skills-data';

export const PHASE_ORDER: Phase[] = [
  'foundations',
  'define',
  'plan',
  'build',
  'test',
  'review',
  'simplify',
  'ship',
];

export const PHASE_META: Record<Phase, { label: string; command: string }> = {
  foundations: { label: 'Foundations', command: '' },
  define: { label: 'Define', command: '/spec' },
  plan: { label: 'Plan', command: '/plan' },
  build: { label: 'Build', command: '/build' },
  test: { label: 'Test', command: '/test' },
  review: { label: 'Review', command: '/review' },
  simplify: { label: 'Simplify', command: '/code-simplify' },
  ship: { label: 'Ship', command: '/ship' },
};

/** Site IA mapping from SPEC §3 — overrides upstream README lifecycle grouping. */
export const SKILL_PHASE_MAP: Record<string, Phase> = {
  'using-agent-skills': 'foundations',
  'interview-me': 'foundations',
  'doubt-driven-development': 'foundations',
  'context-engineering': 'foundations',
  'source-driven-development': 'foundations',
  'idea-refine': 'define',
  'spec-driven-development': 'define',
  'planning-and-task-breakdown': 'plan',
  'incremental-implementation': 'build',
  'test-driven-development': 'build',
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
