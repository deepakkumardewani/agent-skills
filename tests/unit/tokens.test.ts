import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const designMd = readFileSync('DESIGN.md', 'utf8');
const tokensCss = readFileSync('src/styles/tokens.css', 'utf8');

const frontmatterMatch = designMd.match(/^---\n([\s\S]*?)\n---/);
if (!frontmatterMatch) {
  throw new Error('DESIGN.md frontmatter not found');
}

function parseYamlColors(yaml: string): string[] {
  const colors: string[] = [];
  let inColors = false;

  for (const line of yaml.split('\n')) {
    if (line.startsWith('colors:')) {
      inColors = true;
      continue;
    }

    if (inColors) {
      if (/^\S/.test(line) && !line.startsWith('  ')) {
        break;
      }

      const match = line.match(/^ {2}([\w-]+):/);
      if (match) {
        colors.push(match[1]);
      }
    }
  }

  return colors;
}

function toCssVarName(colorKey: string): string {
  if (colorKey.startsWith('phase-')) {
    return `--${colorKey}`;
  }

  const aliases: Record<string, string> = {
    background: '--color-bg-default',
    'on-surface': '--color-fg-default',
    'on-surface-muted': '--color-fg-muted',
    'on-surface-subtle': '--color-fg-subtle',
    'on-surface-inverse': '--color-fg-inverse',
    primary: '--color-accent',
  };

  if (aliases[colorKey]) {
    return aliases[colorKey];
  }

  return `--color-${colorKey}`;
}

describe('tokens.css', () => {
  it('defines every color token from DESIGN.md frontmatter', () => {
    const colorKeys = parseYamlColors(frontmatterMatch[1]);
    const cssVars = colorKeys.map(toCssVarName);

    for (const cssVar of cssVars) {
      expect(tokensCss, `missing ${cssVar}`).toContain(`${cssVar}:`);
    }
  });

  it('defines core semantic tokens used by components', () => {
    const required = [
      '--font-sans',
      '--font-mono',
      '--space-prose-max',
      '--radius-default',
      '--shadow-focus',
      '--duration-fast',
      '--ease-out',
    ];

    for (const token of required) {
      expect(tokensCss, `missing ${token}`).toContain(`${token}:`);
    }
  });

  it('overrides key tokens in dark mode', () => {
    const darkBlock = tokensCss.match(/\[data-theme=["']dark["']\]\s*\{([\s\S]*?)\n\}/);
    expect(darkBlock).not.toBeNull();

    const darkCss = darkBlock?.[1] ?? '';
    expect(darkCss).toContain('--color-bg-default: #0c0a09');
    expect(darkCss).toContain('--color-fg-default: #f5f5f4');
    expect(darkCss).toContain('--color-accent: #f59e0b');
  });
});
