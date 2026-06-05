import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { syncSkills } from '../../scripts/sync-skills';
import {
  buildSkillRecord,
  buildSkillsData,
  buildTriggers,
  classifyPhase,
  extractBody,
  formatSkillMarkdown,
  groupSkills,
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

  it('ignores frontmatter lines without a colon separator', () => {
    const parsed = parseFrontmatter(`---
name: idea-refine
not-a-key-value-line
description: A sample skill used by sync-skills unit tests.
---

# Body`);
    expect(parsed?.name).toBe('idea-refine');
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
    expect(buildTriggers('spec-driven-development', 'define', '/spec')).toEqual(['/spec']);
    expect(buildTriggers('idea-refine', 'define', '/spec')).toEqual([]);
    expect(buildTriggers('using-agent-skills', 'meta', '')).toEqual([]);
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

  it('sorts skills alphabetically within each phase group', () => {
    const data = buildSkillsData([
      {
        slug: 'z-skill',
        name: 'z-skill',
        description: 'Z',
        phase: 'define',
        triggers: [],
        related: [],
      },
      {
        slug: 'a-skill',
        name: 'a-skill',
        description: 'A',
        phase: 'define',
        triggers: [],
        related: [],
      },
    ]);

    const defineGroup = data.groups.find((group) => group.phase === 'define');
    expect(defineGroup?.skills.map((skill) => skill.slug)).toEqual(['a-skill', 'z-skill']);
    expect(
      groupSkills(data.skills)
        .find((group) => group.phase === 'define')
        ?.skills.map((skill) => skill.slug),
    ).toEqual(['a-skill', 'z-skill']);
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

  it('throws when a skill file has invalid frontmatter', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sync-skills-invalid-'));
    const skillsDir = join(tempRoot, 'skills', 'broken-skill');
    const contentDir = join(tempRoot, 'content');
    const dataFile = join(tempRoot, 'skills-data.ts');

    try {
      mkdirSync(skillsDir, { recursive: true });
      writeFileSync(join(skillsDir, 'SKILL.md'), '# Missing frontmatter\n', 'utf8');

      expect(() =>
        syncSkills({
          sourceRoot: tempRoot,
          contentDir,
          dataFile,
        }),
      ).toThrow(/Invalid frontmatter/);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('updates changed content and metadata files on subsequent syncs', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sync-skills-update-'));
    const contentDir = join(tempRoot, 'content');
    const dataFile = join(tempRoot, 'skills-data.ts');

    try {
      const first = syncSkills({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
        dataFile,
      });
      expect(first.summary.created).toBeGreaterThan(0);

      const skillPath = join(FIXTURES_SKILLS, 'idea-refine/SKILL.md');
      const original = readFileSync(skillPath, 'utf8');
      writeFileSync(
        join(contentDir, 'idea-refine.md'),
        original.replace('phase: define', 'phase: define\n# touched'),
        'utf8',
      );

      const second = syncSkills({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
        dataFile,
      });
      expect(second.summary.updated).toBeGreaterThan(0);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('ignores non-markdown files when removing stale content', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sync-skills-stale-'));
    const contentDir = join(tempRoot, 'content');
    const dataFile = join(tempRoot, 'skills-data.ts');

    try {
      mkdirSync(contentDir, { recursive: true });
      writeFileSync(join(contentDir, 'notes.txt'), 'keep me', 'utf8');
      writeFileSync(join(contentDir, 'orphan-skill.md'), '---\nslug: orphan\n---\n', 'utf8');

      const result = syncSkills({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
        dataFile,
      });

      expect(result.summary.removed).toBe(1);
      expect(existsSync(join(contentDir, 'notes.txt'))).toBe(true);
      expect(existsSync(join(contentDir, 'orphan-skill.md'))).toBe(false);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
