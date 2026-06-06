import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Skill } from '../src/data/skills-data';
import {
  buildSetupGuideMeta,
  formatSetupGuideMarkdown,
  SETUP_GUIDE_SOURCES,
} from './sync-setup-guides-lib';
import {
  buildSkillRecord,
  buildSkillsData,
  extractBody,
  formatSkillMarkdown,
  generateSkillsDataSource,
  parseFrontmatter,
} from './sync-skills-lib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ROOT = resolve(ROOT, '../agent-skills');
const CONTENT_DIR = join(ROOT, 'src/content/skills');
const SETUP_GUIDES_DIR = join(ROOT, 'src/content/setup-guides');
const DATA_FILE = join(ROOT, 'src/data/skills-data.ts');

interface WriteSummary {
  created: number;
  updated: number;
  unchanged: number;
  removed: number;
}

function writeIfChanged(path: string, content: string): 'created' | 'updated' | 'unchanged' {
  if (!existsSync(path)) {
    writeFileSync(path, content, 'utf8');
    return 'created';
  }

  const existing = readFileSync(path, 'utf8');
  if (existing === content) {
    return 'unchanged';
  }

  writeFileSync(path, content, 'utf8');
  return 'updated';
}

function removeStaleContentFiles(contentDir: string, activeSlugs: Set<string>): number {
  if (!existsSync(contentDir)) {
    return 0;
  }

  let removed = 0;
  for (const file of readdirSync(contentDir)) {
    if (!file.endsWith('.md')) {
      continue;
    }

    const slug = file.replace(/\.md$/, '');
    if (!activeSlugs.has(slug)) {
      unlinkSync(join(contentDir, file));
      removed += 1;
    }
  }

  return removed;
}

export function syncSkills(
  options: { sourceRoot?: string; contentDir?: string; dataFile?: string } = {},
) {
  const sourceRoot = options.sourceRoot ?? SOURCE_ROOT;
  const skillsDir = join(sourceRoot, 'skills');
  const contentDir = options.contentDir ?? CONTENT_DIR;
  const dataFile = options.dataFile ?? DATA_FILE;

  if (!existsSync(skillsDir)) {
    throw new Error(`Skills source directory not found: ${skillsDir}`);
  }

  const slugs = readdirSync(skillsDir)
    .filter((entry) => statSync(join(skillsDir, entry)).isDirectory())
    .sort((a, b) => a.localeCompare(b));

  const knownSlugs = new Set(slugs);
  const skills: Skill[] = [];

  mkdirSync(contentDir, { recursive: true });

  const summary: WriteSummary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    removed: 0,
  };

  for (const slug of slugs) {
    const skillPath = join(skillsDir, slug, 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');
    const parsed = parseFrontmatter(content);

    if (!parsed) {
      throw new Error(`Invalid frontmatter in ${skillPath}`);
    }

    const body = extractBody(content);
    const skill = buildSkillRecord(slug, parsed, content, knownSlugs);
    skills.push(skill);

    const markdown = formatSkillMarkdown(skill, body);
    const targetPath = join(contentDir, `${slug}.md`);
    const result = writeIfChanged(targetPath, markdown);
    summary[result] += 1;
  }

  summary.removed = removeStaleContentFiles(contentDir, knownSlugs);

  const data = buildSkillsData(skills);
  const dataSource = generateSkillsDataSource(data);
  const dataResult = writeIfChanged(dataFile, dataSource);
  if (dataResult === 'created') {
    summary.created += 1;
  } else if (dataResult === 'updated') {
    summary.updated += 1;
  } else {
    summary.unchanged += 1;
  }

  return {
    skillCount: skills.length,
    summary,
  };
}

export function syncSetupGuides(options: { sourceRoot?: string; contentDir?: string } = {}) {
  const sourceRoot = options.sourceRoot ?? SOURCE_ROOT;
  const docsDir = join(sourceRoot, 'docs');
  const contentDir = options.contentDir ?? SETUP_GUIDES_DIR;

  if (!existsSync(docsDir)) {
    throw new Error(`Setup guides source directory not found: ${docsDir}`);
  }

  mkdirSync(contentDir, { recursive: true });

  const activeSlugs = new Set(SETUP_GUIDE_SOURCES.map((guide) => guide.slug));
  const summary: WriteSummary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    removed: 0,
  };

  for (const guide of SETUP_GUIDE_SOURCES) {
    const sourcePath = join(docsDir, guide.source);
    if (!existsSync(sourcePath)) {
      throw new Error(`Setup guide source file not found: ${sourcePath}`);
    }

    const rawContent = readFileSync(sourcePath, 'utf8');
    const meta = buildSetupGuideMeta(guide.source, guide.slug, guide.tool, rawContent);
    const markdown = formatSetupGuideMarkdown(meta, rawContent);
    const targetPath = join(contentDir, `${guide.slug}.md`);
    const result = writeIfChanged(targetPath, markdown);
    summary[result] += 1;
  }

  summary.removed = removeStaleContentFiles(contentDir, activeSlugs);

  return {
    guideCount: SETUP_GUIDE_SOURCES.length,
    summary,
  };
}

function main() {
  console.log(`Syncing skills from ${SOURCE_ROOT}`);

  const { skillCount, summary } = syncSkills();

  console.log(`Skills processed: ${skillCount}`);
  console.log(
    `Skill content — created: ${summary.created}, updated: ${summary.updated}, unchanged: ${summary.unchanged}, removed: ${summary.removed}`,
  );

  const setupResult = syncSetupGuides();

  console.log(`Setup guides processed: ${setupResult.guideCount}`);
  console.log(
    `Setup guide content — created: ${setupResult.summary.created}, updated: ${setupResult.summary.updated}, unchanged: ${setupResult.summary.unchanged}, removed: ${setupResult.summary.removed}`,
  );
}

if (import.meta.main) {
  main();
}
