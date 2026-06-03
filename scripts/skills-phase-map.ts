import type { Phase } from '../src/data/skills-data';

export const PHASE_ORDER: Phase[] = [
  'meta',
  'define',
  'plan',
  'build',
  'test',
  'review',
  'simplify',
  'ship',
];

export const PHASE_META: Record<Phase, { label: string; command: string }> = {
  meta: { label: 'Meta', command: '' },
  define: { label: 'Define', command: '/spec' },
  plan: { label: 'Plan', command: '/plan' },
  build: { label: 'Build', command: '/build' },
  test: { label: 'Test', command: '/test' },
  review: { label: 'Review', command: '/review' },
  simplify: { label: 'Simplify', command: '/code-simplify' },
  ship: { label: 'Ship', command: '/ship' },
};

/** README Commands table — one lead skill per ADLC command. */
export const LEAD_SKILL_BY_COMMAND: Record<string, string> = {
  '/spec': 'spec-driven-development',
  '/plan': 'planning-and-task-breakdown',
  '/build': 'incremental-implementation',
  '/test': 'test-driven-development',
  '/review': 'code-review-and-quality',
  '/code-simplify': 'code-simplification',
  '/ship': 'shipping-and-launch',
};

/** Site IA mapping from spec §3.1 — overrides upstream README lifecycle grouping. */
export const SKILL_PHASE_MAP: Record<string, Phase> = {
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
