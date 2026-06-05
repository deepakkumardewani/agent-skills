import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { syncSkills } from '../../scripts/sync-skills';
import {
  buildSkillRecord,
  buildTriggers,
  classifyPhase,
  extractBody,
  formatSkillMarkdown,
  normalizeSlug,
  parseFrontmatter,
  resolveRelatedSkills,
} from '../../scripts/sync-skills-lib';

const FIXTURES_ROOT = join(process.cwd(), 'tests/unit/fixtures');
const FIXTURES_SKILLS = join(FIXTURES_ROOT, 'skills');

describe('sync-skills helpers', () => {
  it('normalizes slug values', () => {
    expect(normalizeSlug('  Frontend UI Engineering ')).toBe('frontend-ui-engineering');
    expect(normalizeSlug('Code_Simplify')).toBe('code-simplify');
  });

  it('extracts YAML frontmatter and body', () => {
    const fixture = readFileSync(join(FIXTURES_SKILLS, 'idea-refine/SKILL.md'), 'utf8');
    const parsed = parseFrontmatter(fixture);

    expect(parsed).toEqual({
      name: 'idea-refine',
      description: 'A sample skill used by sync-skills unit tests.',
      raw: {
        name: 'idea-refine',
        description: 'A sample skill used by sync-skills unit tests.',
      },
    });

    expect(extractBody(fixture)).toContain('Follow the `planning-and-task-breakdown` skill');
  });

  it('classifies skills into SPEC lifecycle phases', () => {
    expect(classifyPhase('interview-me')).toBe('define');
    expect(classifyPhase('using-agent-skills')).toBe('meta');
    expect(classifyPhase('context-engineering')).toBe('build');
    expect(classifyPhase('spec-driven-development')).toBe('define');
    expect(classifyPhase('code-simplification')).toBe('simplify');
    expect(classifyPhase('shipping-and-launch')).toBe('ship');
    expect(() => classifyPhase('unknown-skill')).toThrow(/No phase mapping/);
  });

  it('returns null for invalid frontmatter input', () => {
    expect(parseFrontmatter('# No frontmatter')).toBeNull();
    expect(parseFrontmatter('---\nname: only-name\n---\n')).toBeNull();
  });

  it('falls back when frontmatter delimiters are missing in body extraction', () => {
    expect(extractBody('Plain markdown body')).toBe('Plain markdown body');
  });

  it('resolves related skills from explicit cross-references', () => {
    const fixture = readFileSync(join(FIXTURES_SKILLS, 'idea-refine/SKILL.md'), 'utf8');
    const known = new Set([
      'idea-refine',
      'planning-and-task-breakdown',
      'debugging-and-error-recovery',
    ]);

    expect(resolveRelatedSkills(fixture, known, 'idea-refine')).toEqual([
      'debugging-and-error-recovery',
      'planning-and-task-breakdown',
    ]);
  });

  it('builds triggers for lead skills only', () => {
    expect(buildTriggers('spec-driven-development', 'define')).toEqual(['/spec']);
    expect(buildTriggers('test-driven-development', 'build')).toEqual(['/test']);
    expect(buildTriggers('idea-refine', 'define')).toEqual([]);
    expect(buildTriggers('using-agent-skills', 'meta')).toEqual([]);
  });

  it('formats normalized markdown frontmatter', () => {
    const skill = buildSkillRecord(
      'idea-refine',
      {
        name: 'idea-refine',
        description: 'A sample skill used by sync-skills unit tests.',
        raw: {},
      },
      readFileSync(join(FIXTURES_SKILLS, 'idea-refine/SKILL.md'), 'utf8'),
      new Set(['idea-refine', 'planning-and-task-breakdown', 'debugging-and-error-recovery']),
    );

    const output = formatSkillMarkdown(skill, '# Body');
    expect(output).toContain('phase: define');
    expect(output).toContain('triggers: []');
    expect(output).toContain(
      'related: ["debugging-and-error-recovery","planning-and-task-breakdown"]',
    );
  });
});

describe('syncSkills', () => {
  it('writes content and metadata idempotently from fixture source', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sync-skills-'));
    const contentDir = join(tempRoot, 'content');
    const dataFile = join(tempRoot, 'skills-data.ts');

    try {
      mkdirSync(contentDir, { recursive: true });
      writeFileSync(join(contentDir, 'stale-skill.md'), '---\nslug: stale\n---\n', 'utf8');

      const first = syncSkills({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
        dataFile,
      });

      expect(first.skillCount).toBe(3);
      expect(first.summary.removed).toBe(1);
      expect(readFileSync(join(contentDir, 'idea-refine.md'), 'utf8')).toContain('phase: define');

      const second = syncSkills({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
        dataFile,
      });

      expect(second.summary.created).toBe(0);
      expect(second.summary.updated).toBe(0);
      expect(second.summary.unchanged).toBeGreaterThan(0);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('throws when the source directory is missing', () => {
    expect(() =>
      syncSkills({
        sourceRoot: join(tmpdir(), 'missing-agent-skills'),
        contentDir: join(tmpdir(), 'missing-content'),
        dataFile: join(tmpdir(), 'missing-data.ts'),
      }),
    ).toThrow(/Skills source directory not found/);
  });
});
