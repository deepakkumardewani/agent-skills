import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

/** Gzip byte limits from tasks/todo.md Slice 12.3 */
export const JS_BUDGET_BYTES = {
  landing: 30 * 1024,
  skill: 50 * 1024,
} as const;

const SCRIPT_REF_PATTERN = /_astro\/[^"']+\.js/g;

export function extractScriptRefsFromHtml(html: string): string[] {
  return [...new Set([...html.matchAll(SCRIPT_REF_PATTERN)].map((match) => match[0]))];
}

export function gzipSizeBytes(filePath: string): number {
  const raw = readFileSync(filePath);
  return gzipSync(raw).length;
}

export function measurePageJsGzip(
  distDir: string,
  htmlRelativePath: string,
): {
  totalGzipBytes: number;
  scripts: Array<{ ref: string; gzipBytes: number }>;
} {
  const html = readFileSync(join(distDir, htmlRelativePath), 'utf8');
  const refs = extractScriptRefsFromHtml(html);
  const scripts = refs.map((ref) => {
    const gzipBytes = gzipSizeBytes(join(distDir, ref));
    return { ref, gzipBytes };
  });
  const totalGzipBytes = scripts.reduce((sum, entry) => sum + entry.gzipBytes, 0);

  return { totalGzipBytes, scripts };
}
