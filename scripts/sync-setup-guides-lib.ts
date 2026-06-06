export interface SetupGuideMeta {
  slug: string;
  title: string;
  tool: string;
  source: string;
}

export const SETUP_GUIDE_SOURCES: readonly { source: string; slug: string; tool: string }[] = [
  { source: 'cursor-setup.md', slug: 'cursor', tool: 'Cursor' },
  { source: 'gemini-cli-setup.md', slug: 'gemini-cli', tool: 'Gemini CLI' },
  { source: 'windsurf-setup.md', slug: 'windsurf', tool: 'Windsurf' },
  { source: 'opencode-setup.md', slug: 'opencode', tool: 'OpenCode' },
  { source: 'copilot-setup.md', slug: 'copilot', tool: 'GitHub Copilot' },
  { source: 'getting-started.md', slug: 'getting-started', tool: 'Codex / Other Agents' },
] as const;

const INTERNAL_LINK_REWRITES: Record<string, string> = {
  'skill-anatomy.md': '/docs#how-skills-work',
};

export function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (!match) {
    throw new Error('Setup guide is missing an H1 title');
  }

  return match[1].trim();
}

export function rewriteSetupGuideLinks(body: string): string {
  let result = body;

  for (const [filename, target] of Object.entries(INTERNAL_LINK_REWRITES)) {
    const markdownLink = new RegExp(`\\]\\(${filename.replace('.', '\\.')}\\)`, 'g');
    result = result.replace(markdownLink, `](${target})`);
  }

  return result;
}

export function stripLeadingH1(body: string): string {
  return body.replace(/^#\s+.+\r?\n+/, '').trimStart();
}

export function formatSetupGuideMarkdown(meta: SetupGuideMeta, body: string): string {
  const processedBody = rewriteSetupGuideLinks(stripLeadingH1(body));

  return [
    '---',
    `slug: ${meta.slug}`,
    `title: ${JSON.stringify(meta.title)}`,
    `tool: ${JSON.stringify(meta.tool)}`,
    `source: ${JSON.stringify(meta.source)}`,
    '---',
    '',
    processedBody,
    '',
  ].join('\n');
}

export function buildSetupGuideMeta(
  source: string,
  slug: string,
  tool: string,
  rawContent: string,
): SetupGuideMeta {
  return {
    slug,
    tool,
    source: `docs/${source}`,
    title: extractTitle(rawContent),
  };
}
