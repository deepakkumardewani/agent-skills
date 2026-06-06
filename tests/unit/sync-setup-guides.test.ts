import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildSetupGuideMeta,
  extractTitle,
  formatSetupGuideMarkdown,
  rewriteSetupGuideLinks,
  stripLeadingH1,
} from '../../scripts/sync-setup-guides-lib';
import { syncSetupGuides } from '../../scripts/sync-skills';

const FIXTURES_ROOT = join(process.cwd(), 'tests/unit/fixtures');

describe('sync-setup-guides helpers', () => {
  it('extracts title from H1', () => {
    expect(extractTitle('# Using agent-skills with Cursor\n\n## Setup')).toBe(
      'Using agent-skills with Cursor',
    );
  });

  it('strips leading H1 from body', () => {
    expect(stripLeadingH1('# Title\n\n## Section')).toBe('## Section');
  });

  it('rewrites internal doc links to on-site anchors', () => {
    const input = 'See [skill-anatomy.md](skill-anatomy.md) for details.';
    expect(rewriteSetupGuideLinks(input)).toBe(
      'See [skill-anatomy.md](/docs#how-skills-work) for details.',
    );
  });

  it('formats setup guide markdown with frontmatter', () => {
    const meta = buildSetupGuideMeta(
      'cursor-setup.md',
      'cursor',
      'Cursor',
      '# Using agent-skills with Cursor\n\n## Setup',
    );
    const output = formatSetupGuideMarkdown(meta, '# Using agent-skills with Cursor\n\n## Setup');

    expect(output).toContain('slug: cursor');
    expect(output).toContain('tool: "Cursor"');
    expect(output).toContain('source: "docs/cursor-setup.md"');
    expect(output).toContain('## Setup');
    expect(output).not.toMatch(/^# Using agent-skills with Cursor/m);
  });
});

describe('syncSetupGuides', () => {
  it('writes setup guides idempotently from fixture source', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sync-setup-guides-'));
    const contentDir = join(tempRoot, 'content');

    try {
      mkdirSync(contentDir, { recursive: true });
      writeFileSync(join(contentDir, 'stale-guide.md'), '---\nslug: stale\n---\n', 'utf8');

      const first = syncSetupGuides({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
      });

      expect(first.guideCount).toBe(6);
      expect(first.summary.removed).toBe(1);
      expect(readFileSync(join(contentDir, 'cursor.md'), 'utf8')).toContain('tool: "Cursor"');
      expect(readFileSync(join(contentDir, 'getting-started.md'), 'utf8')).toContain(
        '](/docs#how-skills-work)',
      );

      const second = syncSetupGuides({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
      });

      expect(second.summary.created).toBe(0);
      expect(second.summary.updated).toBe(0);
      expect(second.summary.unchanged).toBe(6);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('throws when the docs source directory is missing', () => {
    expect(() =>
      syncSetupGuides({
        sourceRoot: join(tmpdir(), 'missing-agent-skills'),
        contentDir: join(tmpdir(), 'missing-content'),
      }),
    ).toThrow(/Setup guides source directory not found/);
  });

  it('throws when a required setup guide file is missing', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sync-setup-guides-missing-file-'));
    const docsDir = join(tempRoot, 'docs');
    const contentDir = join(tempRoot, 'content');

    try {
      mkdirSync(docsDir, { recursive: true });
      writeFileSync(join(docsDir, 'cursor-setup.md'), '# Cursor\n', 'utf8');

      expect(() =>
        syncSetupGuides({
          sourceRoot: tempRoot,
          contentDir,
        }),
      ).toThrow(/Setup guide source file not found/);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('updates changed setup guide files on subsequent syncs', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sync-setup-guides-update-'));
    const contentDir = join(tempRoot, 'content');

    try {
      syncSetupGuides({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
      });

      const cursorPath = join(contentDir, 'cursor.md');
      writeFileSync(
        cursorPath,
        readFileSync(cursorPath, 'utf8').replace('Cursor', 'Cursor IDE'),
        'utf8',
      );

      const second = syncSetupGuides({
        sourceRoot: FIXTURES_ROOT,
        contentDir,
      });

      expect(second.summary.updated).toBeGreaterThan(0);
      expect(existsSync(cursorPath)).toBe(true);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
